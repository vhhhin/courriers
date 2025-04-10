import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

type DocumentType = "incoming" | "outgoing" | "decision";

const searchFields: Record<DocumentType, string[]> = {
  incoming: ["numéro", "date", "expéditeur", "destinataire", "objet"],
  outgoing: [
    "numéro",
    "date",
    "expéditeur",
    "destinataire",
    "objet",
    "référence",
  ],
  decision: ["numéro", "date", "objet"],
};

interface SearchBarProps {
  onSearch: (type: DocumentType, searchData: Record<string, string>) => void;
  language: "fr" | "ar";
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, language }) => {
  const [type, setType] = useState<DocumentType>("incoming");
  const [searchData, setSearchData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  // Add debounced search
  const debouncedSearch = useCallback(
    debounce((type: DocumentType, data: Record<string, string>) => {
      setError("");
      onSearch(type, data); // Always call onSearch, even with empty data
    }, 300), // 300ms delay for typing
    [onSearch]
  );

  // Trigger search when inputs change
  useEffect(() => {
    debouncedSearch(type, searchData);
  }, [searchData, type, debouncedSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const getPlaceholder = (field: string) => {
    const translations = {
      numéro: language === "ar" ? "رقم الوثيقة" : "Numéro",
      date: language === "ar" ? "التاريخ" : "Date",
      expéditeur: language === "ar" ? "المرسل" : "Expéditeur",
      destinataire: language === "ar" ? "المرسل إليه" : "Destinataire",
      objet: language === "ar" ? "الموضوع" : "Objet",
      référence: language === "ar" ? "المرجع" : "Référence",
    };
    return translations[field as keyof typeof translations] || field;
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as DocumentType);
            setSearchData({});
          }}
          className="p-1.5 border rounded-md text-sm w-32 h-9"
        >
          <option value="incoming">
            {language === "ar" ? "وارد" : "Courrier arrivée"}
          </option>
          <option value="outgoing">
            {language === "ar" ? "صادر" : "Courrier départ"}
          </option>
          <option value="decision">
            {language === "ar" ? "قرار" : "Décision"}
          </option>
        </select>

        {searchFields[type].map((field) => (
          <input
            key={field}
            type={field === "date" ? "date" : "text"}
            name={field}
            placeholder={getPlaceholder(field)}
            value={searchData[field] || ""}
            onChange={handleChange}
            className="p-1.5 border rounded-md text-sm w-32 h-9"
          />
        ))}
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

// Add debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
