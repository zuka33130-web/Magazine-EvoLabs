import { EvoAgentClient } from '../components/evoLabCore/services/evoAgentClient';
import { ObservabilityEngine } from './engine';
export const localObservabilityEngine = new ObservabilityEngine(signal => EvoAgentClient.fetchTelemetryStrict(signal));
