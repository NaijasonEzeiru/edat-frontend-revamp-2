import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export type SelectOption = {
  label: string;
  value: string;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export function Select({ multiple, value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.find((c) => c.value === option.value)) {
        console.log({ value, option });
        onChange(value.filter((o) => o !== option));
      } else {
        console.log({ value, option });
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className="relative h-14 flex gap-2 w-full mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 items-center"
    >
      <span
        className={`grow flex gap-2 items-center overflow-x-auto ${
          multiple ? "self-baseline" : "items-center"
        }`}
      >
        {multiple ? (
          value.map((v) => (
            <button
              key={v.value}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(v);
              }}
              className="flex items-center border border-solid border-gray-800 rounded px-2 py-2 my-2 hover:border-orange-700 group/item h-10 whitespace-nowrap"
            >
              {v.label}
              <span className="text-xl text-gray-500 pl-2 group-hover/item:text-orange-700">
                &times;
              </span>
            </button>
          ))
        ) : (
          <p>{value?.label}</p>
        )}
      </span>
      {multiple && !!value?.length! && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
          className="text-gray-500 text-2xl focus:text-slate-500 hover:text-red-700"
        >
          &times;
        </button>
      )}
      {!!multiple && <div className="bg-[#777] self-stretch w-[0.05em]"></div>}
      <div className="translate-y-0 translate-x-1/4 w-0">
        <FaChevronDown />
      </div>
      <ul
        className={`absolute m-0 p-0 list-none max-h-60 overflow-y-auto border border-solid border-gray-500 rounded w-full left-0 top-[calc(100%+0.25em)] bg-white z-50 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {!!options &&
          options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`py-1 px-2 ${
                isOptionSelected(option) ? "bg-red-700" : ""
              } ${index === highlightedIndex ? "bg-green-700 text-white" : ""}`}
            >
              {option.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
