type Props = { message: string; onRetry?: () => void };
export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
      <p className="font-semibold">Erreur</p>
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-xl border border-red-300 bg-white/80 px-3 py-1.5 text-sm hover:bg-white"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
