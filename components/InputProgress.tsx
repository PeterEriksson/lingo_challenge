type Props = {
  prompt: string;
  minChars?: number;
  maxChars?: number;
};

function InputProgress({ prompt, minChars, maxChars }: Props) {
  const promptAdjusted = prompt.replace(/\s/g, "");
  const progress = (promptAdjusted.length / minChars!) * 100;
  return (
    <div className="absolute w-full -top-[18px] pointer-events-none   ">
      <div className="h-3 relative w-[78%] mx-auto rounded-full overflow-hidden bg-gray-200">
        <div
          className={`h-full absolute top-0 ${
            promptAdjusted.length > maxChars! ? "bg-red-400" : "bg-main"
          } `}
          style={{ width: `${progress}%` }}
        />
      </div>
      {promptAdjusted.length >= minChars! &&
        promptAdjusted.length <= maxChars! && (
          <h4 className="absolute right-12 -top-4 font-bold text-xs text-main/60">
            ok to submit
          </h4>
        )}
      {promptAdjusted.length > maxChars! && (
        <h4 className="absolute right-4 -top-4 font-bold text-xs text-red-400">
          max {maxChars} char input
        </h4>
      )}
    </div>
  );
}

export default InputProgress;
