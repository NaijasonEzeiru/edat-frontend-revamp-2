// TODO: top | items

export const SelectInput = ({
  register,
  fields,
  errors,
  items,
  required = true,
  placeholder,
  top,
  disabled = false,
}: {
  items?: string[] | number[];
  register: {};
  fields: boolean;
  required?: boolean;
  disabled?: boolean;
  errors: string | undefined;
  placeholder: string;
  top?: { name: string; subs?: string[]; cities?: string[] }[];
}) => {
  return (
    <div className="relative w-full">
      <select
        aria-required="true"
        {...register}
        aria-invalid={!!errors}
        aria-errormessage={placeholder}
        className={`w-full p-[10px] border-solid border bg-primaryBg border-opacity-20 rounded-md outline-0 transition-transform invalid:border-red-600 peer ${
          !fields && "normal"
        } ${fields && errors && "border-red-600"} ${fields && "outline-none"}`}
      >
        <option value={-1} disabled></option>
        {items!.map((value, i) => (
          <option key={i} value={value} className="w-10">
            {value}
          </option>
        ))}
      </select>
      <span className="translate-x-[10px] top-0 -translate-y-[7px] text-[0.65rem] py-0 px-[10px] border-x-primaryText tracking-tight transition-transform border border-y-0 leading-4 bg-primaryBg dark:bg-[#18191b] absolute left-0 p-[10px] pointer-events-none uppercase peer[.normal]:transition-transform peer-[.normal]:text-base peer-[.normal]:border-none peer-[.normal]:top-4 peer-focus-visible:!top-0 peer-[.normal]:bg-primaryBg peer-focus-visible:!text-[0.65rem]">
        {placeholder}
        {required && (
          <span className="text-red-400 dark:text-red-300 text-xs">*</span>
        )}
      </span>
      <div
        role="alert"
        id={placeholder}
        className="text-red-400 dark:text-red-300 text-xs"
      >
        {errors}
      </div>
    </div>
  );
};

export const DefaultInput = ({
  register,
  fields,
  errors,
  placeholder,
  type = "text",
  required = true,
}: {
  type: "text" | "number" | "password";
  register: {};
  fields: boolean;
  errors: string | undefined;
  placeholder: string;
  required?: boolean;
}) => {
  return (
    <div className="relative w-full">
      <input
        className={`w-full p-[10px] border-solid border bg-transparent border-opacity-20 rounded-md outline-0 transition-transform invalid:border-red-600 peer ${
          !fields && "normal"
        } ${fields && errors && "border-red-600"} ${fields && "outline-none"}`}
        type={type}
        autoComplete="off"
        {...register}
        aria-invalid={!!errors}
        aria-required={required}
        aria-errormessage={placeholder}
      />
      <span className="translate-x-[10px] top-0 -translate-y-[7px] text-[0.65rem] py-0 px-[10px] border-x-primaryText tracking-tight transition-transform border border-y-0 leading-4 bg-primaryBg dark:bg-[#18191b] absolute left-0 p-[10px] pointer-events-none uppercase peer[.normal]:transition-transform peer-[.normal]:text-base peer-[.normal]:border-none peer-[.normal]:top-4 peer-focus-visible:!top-0 peer-[.normal]:bg-primaryBg peer-focus-visible:!text-[0.65rem]">
        {placeholder}{" "}
        {required && (
          <span className="text-red-400 dark:text-red-300 text-xs">*</span>
        )}
      </span>
      <span
        role="alert"
        id={placeholder}
        className="text-red-400 dark:text-red-300 text-xs"
      >
        {errors}
      </span>
    </div>
  );
};

export const DescriptionInput = ({
  register,
  fields,
  errors,
  placeholder,
  required = true,
}: {
  register: {};
  fields: boolean;
  errors: string | undefined;
  placeholder: string;
  required?: boolean;
}) => {
  return (
    <div className="relative w-full">
      <textarea
        className={`w-full p-[10px] border-solid border bg-transparent border-opacity-20 rounded-md outline-0 transition-transform invalid:border-red-600 peer h-36 ${
          !fields && "normal"
        } ${fields && errors && "border-red-600"} ${fields && "outline-none"}`}
        {...register}
        aria-invalid={!!errors}
        aria-required={required}
        aria-errormessage={placeholder}
      />
      <span className="translate-x-[10px] top-0 -translate-y-[7px] text-[0.65rem] py-0 px-[10px] border-x-primaryText tracking-tight transition-transform border border-y-0 leading-4 bg-primaryBg dark:bg-[#18191b] absolute left-0 p-[10px] pointer-events-none uppercase peer[.normal]:transition-transform peer-[.normal]:text-base peer-[.normal]:border-none peer-[.normal]:top-4 peer-focus-visible:!top-0 peer-[.normal]:bg-primaryBg peer-focus-visible:!text-[0.65rem]">
        {placeholder}{" "}
        {required && (
          <span className="text-red-400 dark:text-red-300 text-xs">*</span>
        )}
      </span>
      <span
        role="alert"
        id={placeholder}
        className="text-red-400 dark:text-red-300 text-xs"
      >
        {errors}
      </span>
    </div>
  );
};
