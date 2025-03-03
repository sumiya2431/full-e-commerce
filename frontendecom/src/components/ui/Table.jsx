// src/components/ui/Table.jsx
import React from "react";

const Table = ({ headers, children }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-200 text-left">
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-4">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
