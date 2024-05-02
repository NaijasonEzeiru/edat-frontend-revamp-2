const AutocompleteInput = ({
  inputValue,
  suggestions,
  setInputValue,
  setSuggestions,
  possibleValues
}: {
  inputValue: string;
  suggestions: string[];
  possibleValues: string[];
  setInputValue: any;
  setSuggestions: any;
}) => {
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const filteredSuggestions = possibleValues.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : ['No matches found']
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    setInputValue(value);
    setSuggestions([]);
  };

  return (
    <label className='relative'>
      Topic
      <input
        value={inputValue}
        onChange={handleInputChange}
        aria-autocomplete='list'
        aria-controls='autocomplete-list'
        className='w-full h-14 mt-1 text-slate-900 border-slate-300 rounded-md pl-[10px] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200'
      />
      {suggestions.length > 0 && (
        <ul
          id='autocomplete-list'
          className='absolute top-full left-0 right-0 border border-[#ccc] bg-white list-none p-0 m-0'
          role='listbox'>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              role='option'
              className='cursor-pointer p-2 hover:bg-[#e9e9e9]'>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default AutocompleteInput;
