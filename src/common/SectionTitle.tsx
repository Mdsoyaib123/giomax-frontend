interface ISectionTitleProp {
  title: string;
  description: string;
}

export default function SectionTitle({
  title,
  description,
}: ISectionTitleProp) {
  return (
    <div>
      <div className="text-start">
        <h2 className="text-3xl font-semibold font-sans mb-4 text-[#0F1325]">
          {title}
        </h2>
        <p className="text-lg text-[#5D646B]">{description}</p>
      </div>
    </div>
  );
}
