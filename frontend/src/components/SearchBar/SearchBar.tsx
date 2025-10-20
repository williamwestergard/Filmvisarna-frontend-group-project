import { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  return (
    <div className="searchbar-container">
      <p className="searchbar-label">Sök film</p>
      <input
        type="text"
        placeholder="Sök film eller genre..."
        value={inputValue}
        onChange={handleChange}
        className="searchbar-input"
      />
    </div>
  );
}
