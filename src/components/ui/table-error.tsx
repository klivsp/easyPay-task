export function TableError() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">
            Data Loading Failed!
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There was a problem loading the data. Please try again!
          </p>
        </div>
      </div>
    </div>
  );
}
