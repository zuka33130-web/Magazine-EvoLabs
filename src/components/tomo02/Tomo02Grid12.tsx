import React from 'react';

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Tomo02Grid12Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
}

const gapClasses: Record<NonNullable<Tomo02Grid12Props['gap']>, string> = {
  none: 'gap-0',
  xs: 'gap-1.5 sm:gap-2',
  sm: 'gap-2 sm:gap-2.5',
  md: 'gap-3 sm:gap-3.5',
  lg: 'gap-4 sm:gap-5',
};

const alignClasses: Record<NonNullable<Tomo02Grid12Props['alignItems']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

/**
 * Sistema de Retícula Editorial de 12 Columnas específico para el Tomo 02.
 * Proporciona alineación proporcional exacta para A4 portrait (210×297mm),
 * asegurando ritmo modular consistente entre texto continuo, callouts, diagramas y terminales.
 */
export const Tomo02Grid12: React.FC<Tomo02Grid12Props> = ({
  children,
  gap = 'md',
  alignItems = 'stretch',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`t02-grid-12 grid grid-cols-12 ${gapClasses[gap]} ${alignClasses[alignItems]} w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface Tomo02ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: ColSpan;
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  children: React.ReactNode;
  className?: string;
}

const spanMap: Record<ColSpan, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

const smSpanMap: Record<ColSpan, string> = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
  7: 'sm:col-span-7',
  8: 'sm:col-span-8',
  9: 'sm:col-span-9',
  10: 'sm:col-span-10',
  11: 'sm:col-span-11',
  12: 'sm:col-span-12',
};

const mdSpanMap: Record<ColSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

const lgSpanMap: Record<ColSpan, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};

export const Tomo02Col: React.FC<Tomo02ColProps> = ({
  span = 12,
  sm,
  md,
  lg,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    spanMap[span],
    sm ? smSpanMap[sm] : '',
    md ? mdSpanMap[md] : '',
    lg ? lgSpanMap[lg] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`t02-col ${classes}`} {...props}>
      {children}
    </div>
  );
};
