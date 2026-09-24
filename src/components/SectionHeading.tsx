interface SectionHeadingProps {
  index: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}

export function SectionHeading({ index, children, aside }: SectionHeadingProps) {
  return (
    <div className="section__head">
      <p className="section__index mono">{index}</p>
      <h2 className="section__title" data-reveal>{children}</h2>
      {aside}
    </div>
  );
}
