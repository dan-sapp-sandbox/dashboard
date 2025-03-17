interface Props {
  children: React.ReactNode;
}

const Card = ({ children }: Props) => {
  return (
    <div className="bg-zinc-500 rounded-xl p-1 flex justify-center w-fit mx-auto">
      {children}
    </div>
  );
};

export default Card;
