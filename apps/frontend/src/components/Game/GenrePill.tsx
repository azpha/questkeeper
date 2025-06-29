export default function GenrePill({ genre = "" }: { genre?: string }) {
  return (
    <div
      className={`bg-gray-200 text-black rounded-lg p-1 font-bold text-xs select-none`}
    >
      <p>{genre}</p>
    </div>
  );
}
