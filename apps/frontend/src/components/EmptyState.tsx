import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function EmptyState({
  to = "",
  buttonLabel = "",
  hint,
}: {
  hint: string;
  to?: string;
  buttonLabel?: string;
}) {
  if (to && to !== "") {
    return (
      <div className="flex flex-col items-center">
        <div className="my-6">
          <h1 className="text-2xl font-bold">Unlimited games, but no games?</h1>
          <p className="text-center">
            There's nothing here. Why not start your collection?
          </p>
          <div className="text-center my-2">
            <Link to={to}>
              <Button variant="secondary">{buttonLabel}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="my-6 text-center">
          <h1 className="text-2xl font-bold">Unlimited games, but no games?</h1>
          <p>{hint}</p>
        </div>
      </div>
    );
  }
}
