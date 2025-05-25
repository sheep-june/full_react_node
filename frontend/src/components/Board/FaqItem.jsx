import { useState } from "react";

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded mb-3 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-medium"
      >
        {faq.title}
      </button>

      {open && (
        <div className="px-4 py-3 bg-white text-sm text-gray-700 border-t">
          <p className="whitespace-pre-line">{faq.content}</p>
          <p className="mt-2 text-xs text-right text-gray-400">
            작성자: {faq.admin?.name || "관리자"} / {new Date(faq.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
