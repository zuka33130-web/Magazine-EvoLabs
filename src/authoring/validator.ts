// ============================================================================
// EVO LABS // CONTENT VALIDATOR (FASE 07)
// Rigorous validation engine ensuring structural integrity, link resolution,
// reference validation, duplicate detection, and semver checking.
// ============================================================================

import {
  AuthoringRegistry,
  TomoSchema,
  ChapterSchema,
  LabSchema,
  CaseSchema,
  SkillSchema,
  CheckSchema,
  EvidenceSchema,
} from './schema';

export interface ValidationError {
  entityType: 'TOMO' | 'CHAPTER' | 'LAB' | 'CASE' | 'SKILL' | 'CHECK' | 'EVIDENCE' | 'GLOBAL';
  entityId: string;
  field: string;
  message: string;
  severity: 'CRITICAL' | 'ERROR';
}

export interface ValidationWarning {
  entityType: 'TOMO' | 'CHAPTER' | 'LAB' | 'CASE' | 'SKILL' | 'CHECK' | 'EVIDENCE';
  entityId: string;
  field: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  errorsCount: number;
  warningsCount: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    tomosCount: number;
    chaptersCount: number;
    labsCount: number;
    casesCount: number;
    skillsCount: number;
    checksCount: number;
    evidencesCount: number;
  };
  validatedAt: string;
}

export class ContentValidator {
  /**
   * Validates semantic versioning string (e.g. "1.0.0", "2.1.4")
   */
  static isValidSemver(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version);
  }

  /**
   * Validates ISO date string
   */
  static isValidIsoDate(dateStr: string): boolean {
    const timestamp = Date.parse(dateStr);
    return !isNaN(timestamp);
  }

  /**
   * Validates an individual Tomo
   */
  static validateTomo(tomo: TomoSchema, registrySkillIds: Set<string>, allTomoIds: Set<string>): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!tomo.id?.trim()) {
      errors.push({ entityType: 'TOMO', entityId: tomo.id || 'unknown', field: 'id', message: 'Tomo ID is missing or empty.', severity: 'CRITICAL' });
    }
    if (!tomo.title?.trim()) {
      errors.push({ entityType: 'TOMO', entityId: tomo.id, field: 'title', message: 'Tomo title is required.', severity: 'ERROR' });
    }
    if (!tomo.tomoNumber?.trim()) {
      errors.push({ entityType: 'TOMO', entityId: tomo.id, field: 'tomoNumber', message: 'Tomo number is required.', severity: 'ERROR' });
    }
    if (!this.isValidSemver(tomo.version)) {
      errors.push({ entityType: 'TOMO', entityId: tomo.id, field: 'version', message: `Invalid semver "${tomo.version}". Must match x.y.z.`, severity: 'ERROR' });
    }
    if (!this.isValidIsoDate(tomo.updatedAt)) {
      warnings.push({ entityType: 'TOMO', entityId: tomo.id, field: 'updatedAt', message: `UpdatedAt "${tomo.updatedAt}" is not a valid ISO date.` });
    }

    // Check prerequisites
    tomo.prerequisiteTomoIds.forEach((prereqId) => {
      if (!allTomoIds.has(prereqId) && prereqId !== tomo.id) {
        errors.push({ entityType: 'TOMO', entityId: tomo.id, field: 'prerequisiteTomoIds', message: `Referenced prerequisite Tomo "${prereqId}" does not exist.`, severity: 'ERROR' });
      }
    });

    // Check target skills
    tomo.targetSkills.forEach((skillId) => {
      if (!registrySkillIds.has(skillId)) {
        warnings.push({ entityType: 'TOMO', entityId: tomo.id, field: 'targetSkills', message: `Target skill "${skillId}" is not registered in skills registry.` });
      }
    });

    if (!tomo.chapters || tomo.chapters.length === 0) {
      warnings.push({ entityType: 'TOMO', entityId: tomo.id, field: 'chapters', message: 'Tomo has no chapters defined.' });
    }

    return { errors, warnings };
  }

  /**
   * Validates an individual Chapter
   */
  static validateChapter(chapter: ChapterSchema, registrySkillIds: Set<string>, allTomoIds: Set<string>): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!chapter.id?.trim()) {
      errors.push({ entityType: 'CHAPTER', entityId: chapter.id || 'unknown', field: 'id', message: 'Chapter ID is missing.', severity: 'CRITICAL' });
    }
    if (!chapter.title?.trim()) {
      errors.push({ entityType: 'CHAPTER', entityId: chapter.id, field: 'title', message: 'Chapter title is required.', severity: 'ERROR' });
    }
    if (!allTomoIds.has(chapter.tomoId)) {
      errors.push({ entityType: 'CHAPTER', entityId: chapter.id, field: 'tomoId', message: `Referenced parent Tomo "${chapter.tomoId}" does not exist.`, severity: 'ERROR' });
    }
    if (!this.isValidSemver(chapter.version)) {
      errors.push({ entityType: 'CHAPTER', entityId: chapter.id, field: 'version', message: `Invalid semver "${chapter.version}".`, severity: 'ERROR' });
    }

    // Sections duplicate check
    const sectionIds = new Set<string>();
    chapter.sections.forEach((sec) => {
      if (!sec.id?.trim()) {
        errors.push({ entityType: 'CHAPTER', entityId: chapter.id, field: 'sections', message: 'Section missing ID.', severity: 'ERROR' });
      } else if (sectionIds.has(sec.id)) {
        errors.push({ entityType: 'CHAPTER', entityId: chapter.id, field: 'sections', message: `Duplicate section ID "${sec.id}".`, severity: 'ERROR' });
      }
      sectionIds.add(sec.id);
    });

    // Check skills
    chapter.targetSkills.forEach((sk) => {
      if (!registrySkillIds.has(sk)) {
        warnings.push({ entityType: 'CHAPTER', entityId: chapter.id, field: 'targetSkills', message: `Referenced skill "${sk}" is not registered.` });
      }
    });

    return { errors, warnings };
  }

  /**
   * Validates an entire registry cross-checking all references and duplicates
   */
  static validateRegistry(registry: AuthoringRegistry): ValidationReport {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const allIds = new Map<string, string>(); // ID -> EntityType

    const checkDuplicateId = (id: string, entityType: any) => {
      if (!id) return;
      if (allIds.has(id)) {
        errors.push({
          entityType,
          entityId: id,
          field: 'id',
          message: `Duplicate ID detected! "${id}" already defined as ${allIds.get(id)}.`,
          severity: 'CRITICAL',
        });
      } else {
        allIds.set(id, entityType);
      }
    };

    // Index Skills
    const skillIds = new Set<string>();
    registry.skills.forEach((sk) => {
      checkDuplicateId(sk.id, 'SKILL');
      skillIds.add(sk.id);
      if (!sk.name?.trim()) {
        errors.push({ entityType: 'SKILL', entityId: sk.id, field: 'name', message: 'Skill name is required.', severity: 'ERROR' });
      }
    });

    // Index Tomos
    const tomoIds = new Set<string>();
    registry.tomos.forEach((tm) => {
      checkDuplicateId(tm.id, 'TOMO');
      tomoIds.add(tm.id);
    });

    // Validate Tomos
    registry.tomos.forEach((tm) => {
      const tomoVal = this.validateTomo(tm, skillIds, tomoIds);
      errors.push(...tomoVal.errors);
      warnings.push(...tomoVal.warnings);
    });

    // Validate Chapters
    registry.chapters.forEach((ch) => {
      checkDuplicateId(ch.id, 'CHAPTER');
      const chVal = this.validateChapter(ch, skillIds, tomoIds);
      errors.push(...chVal.errors);
      warnings.push(...chVal.warnings);
    });

    // Validate Labs
    registry.labs.forEach((lb) => {
      checkDuplicateId(lb.id, 'LAB');
      if (!lb.title?.trim()) {
        errors.push({ entityType: 'LAB', entityId: lb.id, field: 'title', message: 'Lab title is required.', severity: 'ERROR' });
      }
      if (!tomoIds.has(lb.tomoId)) {
        errors.push({ entityType: 'LAB', entityId: lb.id, field: 'tomoId', message: `Lab parent Tomo "${lb.tomoId}" does not exist.`, severity: 'ERROR' });
      }
      if (!lb.steps || lb.steps.length === 0) {
        warnings.push({ entityType: 'LAB', entityId: lb.id, field: 'steps', message: 'Lab has no steps defined.' });
      }
    });

    // Validate Cases
    registry.cases.forEach((cs) => {
      checkDuplicateId(cs.id, 'CASE');
      if (!cs.title?.trim()) {
        errors.push({ entityType: 'CASE', entityId: cs.id, field: 'title', message: 'Case title is required.', severity: 'ERROR' });
      }
      if (!cs.symptoms || cs.symptoms.length === 0) {
        errors.push({ entityType: 'CASE', entityId: cs.id, field: 'symptoms', message: 'Case must have at least 1 symptom.', severity: 'ERROR' });
      }
      if (!cs.hypotheses || cs.hypotheses.length === 0) {
        errors.push({ entityType: 'CASE', entityId: cs.id, field: 'hypotheses', message: 'Case must have at least 1 hypothesis candidate.', severity: 'ERROR' });
      }
    });

    // Validate Checks
    registry.checks.forEach((chk) => {
      checkDuplicateId(chk.id, 'CHECK');
      if (!chk.question?.trim()) {
        errors.push({ entityType: 'CHECK', entityId: chk.id, field: 'question', message: 'Check question is required.', severity: 'ERROR' });
      }
      const hasCorrect = chk.options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        errors.push({ entityType: 'CHECK', entityId: chk.id, field: 'options', message: 'Check has no correct option marked.', severity: 'ERROR' });
      }
    });

    // Validate Evidences
    registry.evidences.forEach((ev) => {
      checkDuplicateId(ev.id, 'EVIDENCE');
      if (!ev.title?.trim()) {
        errors.push({ entityType: 'EVIDENCE', entityId: ev.id, field: 'title', message: 'Evidence title is required.', severity: 'ERROR' });
      }
    });

    return {
      isValid: errors.length === 0,
      errorsCount: errors.length,
      warningsCount: warnings.length,
      errors,
      warnings,
      stats: {
        tomosCount: registry.tomos.length,
        chaptersCount: registry.chapters.length,
        labsCount: registry.labs.length,
        casesCount: registry.cases.length,
        skillsCount: registry.skills.length,
        checksCount: registry.checks.length,
        evidencesCount: registry.evidences.length,
      },
      validatedAt: new Date().toISOString(),
    };
  }
}
