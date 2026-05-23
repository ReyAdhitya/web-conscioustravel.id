import { TreeLoader } from "@/components/loaders/TreeLoader";

export default function PublicLoading() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <TreeLoader />
    </div>
  );
}
