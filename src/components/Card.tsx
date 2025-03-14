interface Props {
  children: React.ReactNode;
}

const Card = ({ children }: Props) => {
  return (
    <div className="bg-zinc-500 col-span-6 rounded-xl p-1">
      {children}
    </div>
  );
};

export default Card;
