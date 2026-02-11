import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FaPlay, FaImage, FaPlus, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaChevronDown, FaChevronUp, FaPalette, FaFont, FaArrowsAltV, FaBorderAll, FaLayerGroup } from "react-icons/fa";

const VARIABLE_OPTIONS = [
  { label: "First Name", value: "{FirstName}" },
  { label: "Last Name", value: "{LastName}" },
  { label: "Company", value: "{Company}" },
  { label: "Link", value: "{Link}" },
];

const VariableTextarea = ({ value, onChange, className, placeholder, style }) => {
  const textareaRef = useRef(null);

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || "";
    const newText = text.substring(0, start) + variable + text.substring(end);

    // Call parent onChange with event-like object
    onChange({ target: { value: newText } });

    // Restore focus and cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  return (
    <div className="relative group/vars">
      <div className="absolute right-0 -top-7 opacity-0 group-hover/vars:opacity-100 transition-opacity bg-white border border-gray-200 shadow-lg rounded-lg flex gap-1 p-1 z-50">
        {VARIABLE_OPTIONS.map(v => (
          <button
            key={v.value}
            onClick={() => insertVariable(v.value)}
            className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
            title={`Insert ${v.label}`}
          >
            {v.value}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={style}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
      />
    </div>
  );
};

export const AdvancedStyleControls = ({ block, updateStyle }) => {
  const [openSection, setOpenSection] = useState("typography");

  const Section = ({ id, title, icon, children }) => {
    const isOpen = openSection === id;
    return (
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-2 shadow-sm">
        <button
          onClick={() => setOpenSection(isOpen ? null : id)}
          className={`w-full flex items-center justify-between p-3 transition text-xs font-bold uppercase tracking-wider ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {isOpen && <div className="p-3 grid grid-cols-2 gap-3 bg-gray-50/50">{children}</div>}
      </div>
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-2 scale-95 origin-top-left w-[105%]">
      {/* Typography Section */}
      <Section id="typography" title="Typography" icon={<FaFont />}>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Font Family</label>
          <select
            value={block.style?.fontFamily || "inherit"}
            onChange={(e) => updateStyle("fontFamily", e.target.value)}
            className="text-xs border rounded p-1 bg-white h-8"
          >
            <option value="inherit">Default</option>
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Outfit', sans-serif">Outfit</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Courier New', monospace">Courier</option>
            <option value="'Handlee', cursive">Handlee</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Size ({block.style?.fontSize}px)</label>
          <input type="range" min="10" max="100" value={block.style?.fontSize || 16} onChange={(e) => updateStyle("fontSize", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Weight</label>
          <select value={block.style?.fontWeight || "normal"} onChange={(e) => updateStyle("fontWeight", e.target.value)} className="text-xs border rounded p-1 bg-white h-8">
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="700">Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Alignment</label>
          <div className="flex bg-white rounded border border-gray-200 p-1 gap-1 justify-center h-8 items-center">
            {[
              { val: "left", icon: <FaAlignLeft /> },
              { val: "center", icon: <FaAlignCenter /> },
              { val: "right", icon: <FaAlignRight /> },
              { val: "justify", icon: <FaAlignJustify /> }
            ].map(opt => (
              <button key={opt.val} onClick={() => updateStyle("textAlign", opt.val)} className={`p-1 rounded ${block.style?.textAlign === opt.val ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Text Color</label>
          <div className="flex items-center gap-2 h-8">
            <input type="color" value={block.style?.textColor || "#000000"} onChange={(e) => updateStyle("textColor", e.target.value)} className="w-8 h-8 rounded border-none p-0 cursor-pointer" />
            <span className="text-[10px] text-gray-400">{block.style?.textColor}</span>
          </div>
        </div>
      </Section>

      {/* Spacing & Layout */}
      <Section id="spacing" title="Spacing & Layout" icon={<FaLayerGroup />}>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Padding ({block.style?.padding || 0}px)</label>
          <input type="range" min="0" max="100" value={block.style?.padding || 0} onChange={(e) => updateStyle("padding", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Margin Top</label>
          <input type="number" value={block.style?.marginTop} onChange={(e) => updateStyle("marginTop", parseInt(e.target.value))} className="text-xs border rounded p-1 w-full h-8" placeholder="px" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Margin Btm</label>
          <input type="number" value={block.style?.marginBottom} onChange={(e) => updateStyle("marginBottom", parseInt(e.target.value))} className="text-xs border rounded p-1 w-full h-8" placeholder="px" />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Display</label>
          <select value={block.style?.display || "block"} onChange={(e) => updateStyle("display", e.target.value)} className="text-xs border rounded p-1 bg-white w-full h-8">
            <option value="block">Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        {(block.style?.display === "flex" || block.style?.display === "grid") && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Gap</label>
              <input type="number" value={block.style?.gap} onChange={(e) => updateStyle("gap", parseInt(e.target.value))} className="text-xs border rounded p-1 w-full h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Align Items</label>
              <select value={block.style?.alignItems || "stretch"} onChange={(e) => updateStyle("alignItems", e.target.value)} className="text-xs border rounded p-1 w-full h-8">
                <option value="stretch">Stretch</option>
                <option value="center">Center</option>
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Justify Content</label>
              <select value={block.style?.justifyContent || "start"} onChange={(e) => updateStyle("justifyContent", e.target.value)} className="text-xs border rounded p-1 w-full h-8">
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
            </div>
          </>
        )}
      </Section>

      {/* Background & Borders */}
      <Section id="appearance" title="Appearance" icon={<FaPalette />}>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">BG Color</label>
          <div className="flex items-center gap-2 h-8">
            <input type="color" value={block.style?.backgroundColor || "#ffffff"} onChange={(e) => updateStyle("backgroundColor", e.target.value)} className="w-8 h-8 rounded border-none p-0 cursor-pointer" />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Background Image</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Image URL"
              value={block.style?.backgroundImage?.replace(/url\(["']?|["']?\)/g, '') || ""}
              onChange={(e) => updateStyle("backgroundImage", e.target.value ? `url("${e.target.value}")` : "")}
              className="text-xs border rounded p-1 flex-1 h-8"
            />
            <input
              id={`bg-img-upload-${block.id}`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateStyle("backgroundImage", `url("${URL.createObjectURL(file)}")`);
              }}
            />
            <label htmlFor={`bg-img-upload-${block.id}`} className="bg-blue-50 text-blue-600 p-2 rounded cursor-pointer hover:bg-blue-100 transition h-8 flex items-center justify-center">
              <FaImage />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">BG Size</label>
          <select value={block.style?.backgroundSize || "cover"} onChange={(e) => updateStyle("backgroundSize", e.target.value)} className="text-xs border rounded p-1 bg-white h-8">
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="auto">Auto</option>
            <option value="100% 100%">Stretch</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">BG Position</label>
          <select value={block.style?.backgroundPosition || "center"} onChange={(e) => updateStyle("backgroundPosition", e.target.value)} className="text-xs border rounded p-1 bg-white h-8">
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Border Color</label>
          <div className="flex items-center gap-2 h-8">
            <input type="color" value={block.style?.borderColor || "#000000"} onChange={(e) => updateStyle("borderColor", e.target.value)} className="w-8 h-8 rounded border-none p-0 cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Radius ({block.style?.borderRadius || 0})</label>
          <input type="range" min="0" max="50" value={block.style?.borderRadius || 0} onChange={(e) => updateStyle("borderRadius", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Border Width</label>
          <input type="range" min="0" max="20" value={block.style?.borderWidth || 0} onChange={(e) => updateStyle("borderWidth", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Box Shadow</label>
          <input type="text" placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)" value={block.style?.boxShadow || ""} onChange={(e) => updateStyle("boxShadow", e.target.value)} className="text-xs border rounded p-1 w-full h-8" />
        </div>
      </Section>

      {/* Advanced / Custom CSS */}
      <Section id="advanced" title="Advanced" icon={<FaArrowsAltV />}>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Width / Max-Width</label>
          <div className="flex gap-2">
            <input placeholder="Width (100%)" value={block.style?.width} onChange={(e) => updateStyle("width", e.target.value)} className="text-xs border rounded p-1 w-1/2 h-8" />
            <input placeholder="Max Width" value={block.style?.maxWidth} onChange={(e) => updateStyle("maxWidth", e.target.value)} className="text-xs border rounded p-1 w-1/2 h-8" />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Height</label>
          <input placeholder="Height (auto)" value={block.style?.height} onChange={(e) => updateStyle("height", e.target.value)} className="text-xs border rounded p-1 w-full h-8" />
        </div>
      </Section>
    </div>
  );
};

export default function BlockRenderer({ block, blocks, setBlocks, readOnly = false, isSelected = false, onSelect }) {
  const update = (key, value) => {
    const updated = blocks.map((b) =>
      b.id === block.id ? { ...b, [key]: value } : b
    );
    setBlocks(updated);
  };

  const addChild = (columnIndex, type) => {
    const newChild = {
      id: crypto.randomUUID(),
      type,
      content: type === "btn" ? "Click More" : "Enter Text",
      url: "",
      style: {
        fontSize: type === "heading" ? 24 : 16,
        fontWeight: type === "heading" ? "bold" : "normal",
        textColor: "#000000",
        textAlign: "center"
      }
    };
    const newColumns = [...(block.columns || [])];
    newColumns[columnIndex] = [...(newColumns[columnIndex] || []), newChild];
    update("columns", newColumns);
  };

  const updateChild = (columnIndex, childId, key, value) => {
    const newColumns = (block.columns || []).map((col, i) => {
      if (i === columnIndex) {
        return col.map((c) => (c.id === childId ? { ...c, [key]: value } : c));
      }
      return col;
    });
    update("columns", newColumns);
  };

  const removeChild = (columnIndex, childId) => {
    const newColumns = (block.columns || []).map((col, i) => {
      if (i === columnIndex) {
        return col.filter((c) => c.id !== childId);
      }
      return col;
    });
    update("columns", newColumns);
  };

  const updateStyle = (key, value) => {
    const updated = blocks.map((b) =>
      b.id === block.id
        ? { ...b, style: { ...b.style, [key]: value } }
        : b
    );
    setBlocks(updated);
  };

  const addCardToRow = () => {
    const newCard = {
      id: crypto.randomUUID(),
      title: "Card Title",
      description: "Description",
      url: "",
      style: { backgroundColor: "#ffffff", borderRadius: 12, padding: 20 }
    };
    update("cards", [...(block.cards || []), newCard]);
  };

  const updateCardInRow = (cardId, key, value) => {
    const newCards = (block.cards || []).map((c) =>
      c.id === cardId ? { ...c, [key]: value } : c
    );
    update("cards", newCards);
  };

  const removeCardFromRow = (cardId) => {
    const newCards = (block.cards || []).filter((c) => c.id !== cardId);
    update("cards", newCards);
  };

  const addSectionChild = (type) => {
    const newChild = {
      id: crypto.randomUUID(),
      type,
      content: type === "heading" ? "New Heading" : type === "button" ? "Click Me" : "Enter text here...",
      url: "",
      style: {
        fontSize: type === "heading" ? 32 : 16,
        textColor: "#000000",
        textAlign: "center",
        backgroundColor: type === "button" ? "#237FEA" : "transparent"
      }
    };
    update("children", [...(block.children || []), newChild]);
  };

  const updateSectionChild = (childId, key, value) => {
    const newChildren = (block.children || []).map((c) =>
      c.id === childId ? { ...c, [key]: value } : c
    );
    update("children", newChildren);
  };

  const removeSectionChild = (childId) => {
    const newChildren = (block.children || []).filter((c) => c.id !== childId);
    update("children", newChildren);
  };


  const renderContent = () => {
    const getCommonStyles = (b) => ({
      width: b.style?.width || "100%",
      maxWidth: b.style?.maxWidth || "100%",
      height: b.style?.height || "auto",
      minHeight: b.style?.minHeight,
      marginTop: b.style?.marginTop,
      marginBottom: b.style?.marginBottom,
      padding: b.style?.padding,
      backgroundColor: b.style?.backgroundColor,
      backgroundImage: b.style?.backgroundImage || "none",
      backgroundSize: b.style?.backgroundSize || "cover",
      backgroundPosition: b.style?.backgroundPosition || "center",
      borderRadius: b.style?.borderRadius,
      border: `${b.style?.borderWidth || 0}px ${b.style?.borderStyle || "solid"} ${b.style?.borderColor || "transparent"}`,
      display: b.style?.display || "block",
      flexDirection: b.style?.flexDirection,
      gap: b.style?.gap ? `${b.style.gap}px` : undefined,
      alignItems: b.style?.alignItems,
      justifyContent: b.style?.justifyContent,
      boxShadow: b.style?.boxShadow,
      textAlign: b.style?.textAlign,
      opacity: b.style?.opacity,
      zIndex: b.style?.zIndex,
      objectFit: b.style?.objectFit || "fill",

      // Typography
      fontFamily: b.style?.fontFamily,
      fontSize: b.style?.fontSize,
      fontWeight: b.style?.fontWeight,
      color: b.style?.textColor,
      lineHeight: b.style?.lineHeight,
      letterSpacing: b.style?.letterSpacing,
      textDecoration: b.style?.textDecoration,
      textTransform: b.style?.textTransform,
    });

    // CUSTOM SECTION
    if (block.type === "customSection") {
      return (
        <div style={getCommonStyles(block)} className={`relative min-h-[300px] flex flex-col justify-center overflow-hidden ${!readOnly ? "hover:shadow-lg transition-shadow duration-300" : ""}`}>
          {/* BG Upload Overlay */}
          {!readOnly && (
            <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition">
              <input
                id={`bg-upload-${block.id}`}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateStyle("backgroundImage", URL.createObjectURL(file));
                }}
              />
              <label htmlFor={`bg-upload-${block.id}`} className="bg-white/80 p-2 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-white transition">
                Change Background
              </label>
            </div>
          )}

          {/* Children Management */}
          <div className="flex flex-col gap-6 relative z-10">
            {(block.children || []).map((child) => (
              <div key={child.id} className={`relative group/child p-2 border border-transparent ${!readOnly ? "hover:border-blue-200 hover:bg-white/40" : ""} rounded-lg transition`}>
                {!readOnly && (
                  <button
                    className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/child:opacity-100 transition z-20"
                    onClick={() => removeSectionChild(child.id)}
                  >
                    ×
                  </button>
                )}
                {child.type === "heading" && (
                  readOnly ? (
                    <h2 style={{
                      fontSize: child.style?.fontSize,
                      color: child.style?.textColor,
                      textAlign: child.style?.textAlign,
                      fontFamily: block.style?.fontFamily,
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      margin: 0
                    }}>
                      {child.content}
                    </h2>
                  ) : (
                    <input
                      className="w-full bg-transparent outline-none font-bold placeholder-gray-400"
                      value={child.content}
                      onChange={(e) => updateSectionChild(child.id, "content", e.target.value)}
                      style={{
                        fontSize: child.style?.fontSize,
                        color: child.style?.textColor,
                        textAlign: child.style?.textAlign,
                        fontFamily: block.style?.fontFamily
                      }}
                    />
                  )
                )}
                {child.type === "text" && (
                  readOnly ? (
                    <p style={{
                      fontSize: child.style?.fontSize,
                      color: child.style?.textColor,
                      textAlign: child.style?.textAlign,
                      fontFamily: block.style?.fontFamily,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      margin: 0
                    }}>
                      {child.content}
                    </p>
                  ) : (
                    <VariableTextarea
                      className="w-full bg-transparent outline-none resize-none placeholder-gray-400"
                      value={child.content}
                      onChange={(e) => updateSectionChild(child.id, "content", e.target.value)}
                      style={{
                        fontSize: child.style?.fontSize,
                        color: child.style?.textColor,
                        textAlign: child.style?.textAlign,
                        fontFamily: block.style?.fontFamily
                      }}
                    />
                  )
                )}
                {child.type === "logo" && (
                  <div style={{ textAlign: child.style?.textAlign }}>
                    {child.url ? (
                      <img src={child.url} className="mx-auto max-h-16 object-contain" />
                    ) : (
                      !readOnly && <div className="text-[10px] text-gray-400 border border-dashed border-gray-300 rounded p-2">Logo Placeholder</div>
                    )}
                    {!readOnly && (
                      <>
                        <input
                          id={`logo-upload-${child.id}`}
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) updateSectionChild(child.id, "url", URL.createObjectURL(file));
                          }}
                        />
                        <label htmlFor={`logo-upload-${child.id}`} className="text-[10px] text-blue-500 cursor-pointer hover:underline mt-1 block">Upload Logo</label>
                      </>
                    )}
                  </div>
                )}
                {child.type === "button" && (
                  <div style={{ textAlign: child.style?.textAlign }}>
                    <button className="px-6 py-2 rounded-lg font-bold transition transform hover:scale-105" style={{ backgroundColor: child.style?.backgroundColor, color: "#fff" }}>
                      {child.content}
                    </button>
                    {!readOnly && (
                      <input
                        className="block mt-2 mx-auto text-[10px] border rounded p-1 outline-none w-full max-w-[120px] text-center"
                        value={child.content}
                        onChange={(e) => updateSectionChild(child.id, "content", e.target.value)}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add Child Menu */}
            {!readOnly && (
              <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition duration-300">
                {["heading", "text", "button", "logo"].map(t => (
                  <button
                    key={t}
                    onClick={() => addSectionChild(t)}
                    className="bg-white/80 hover:bg-white text-[10px] font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm transition transform hover:scale-105 text-blue-600"
                  >
                    + {t.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      );
    }

    // CARD
    if (block.type === "card") {
      return (
        <div style={getCommonStyles(block)}>
          <div className="space-y-4">
            {/* Image Part */}
            {block.url ? (
              <img src={block.url} className="w-full rounded-lg object-cover h-40" />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                Card Image Preview
              </div>
            )}

            {!readOnly && (
              <>
                <input
                  id={`card-upload-${block.id}`}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) update("url", URL.createObjectURL(file));
                  }}
                />
                <label
                  htmlFor={`card-upload-${block.id}`}
                  className="block text-center text-blue-500 text-xs cursor-pointer hover:underline opacity-0 group-hover:opacity-100 transition"
                >
                  Upload Photo
                </label>
              </>
            )}

            {/* Text Part */}
            {readOnly ? (
              <>
                <h3 style={{ color: block.style?.textColor, textAlign: block.style?.textAlign, fontSize: '1.25rem', fontWeight: 'bold', overflowWrap: "break-word", wordBreak: "break-word" }}>
                  {block.title}
                </h3>
                <p style={{ textAlign: block.style?.textAlign, fontSize: '0.875rem', color: '#4B5563', whiteSpace: 'pre-wrap', overflowWrap: "break-word", wordBreak: "break-word" }}>
                  {block.description}
                </p>
              </>
            ) : (
              <>
                <VariableTextarea
                  className="w-full bg-transparent focus:outline-none border-b border-gray-100 font-bold text-lg resize-none overflow-hidden whitespace-pre-wrap break-words placeholder-gray-400"
                  placeholder="Card Title"
                  value={block.title}
                  onChange={(e) => update("title", e.target.value)}
                  style={{ color: block.style?.textColor, textAlign: block.style?.textAlign }}
                />
                <VariableTextarea
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-600 resize-none min-h-[60px] whitespace-pre-wrap break-words overflow-hidden placeholder-gray-400"
                  placeholder="Card description..."
                  value={block.description}
                  onChange={(e) => update("description", e.target.value)}
                  style={{ textAlign: block.style?.textAlign }}
                />
              </>
            )}
          </div>
        </div>
      );
    }

    // HEADING
    if (block.type === "heading") {
      return (
        <div style={getCommonStyles(block)}>
          {readOnly ? (
            <h2 style={{
              color: block.style?.textColor,
              fontSize: block.style?.fontSize,
              textAlign: block.style?.textAlign,
              fontWeight: block.style?.fontWeight,
              fontFamily: block.style?.fontFamily,
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              margin: 0
            }}>
              {block.content}
            </h2>
          ) : (
            <VariableTextarea
              value={block.content}
              placeholder={block.placeholder}
              onChange={(e) => update("content", e.target.value)}
              className="w-full bg-transparent focus:outline-none border-b border-dashed border-gray-300 pb-1 resize-none overflow-hidden block placeholder-gray-300"
              style={{
                color: block.style?.textColor,
                fontSize: block.style?.fontSize,
                textAlign: block.style?.textAlign,
                fontWeight: block.style?.fontWeight,
                fontFamily: block.style?.fontFamily,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word"
              }}
            />
          )}
        </div>
      );
    }

    // TEXT / PARAGRAPH
    if (block.type === "text") {
      return (
        <div style={getCommonStyles(block)}>
          {readOnly ? (
            <div
              className="rich-text-content"
              style={{
                color: block.style?.textColor,
                fontSize: `${block.style?.fontSize}px`,
                textAlign: block.style?.textAlign,
                fontFamily: block.style?.fontFamily,
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          ) : (
            <div className="p-2 border border-dashed border-gray-200 rounded-lg min-h-[100px] bg-white text-editor-container hover:border-blue-400 transition">
              <ReactQuill
                theme="snow"
                value={block.content}
                onChange={(val) => update("content", val)}
                placeholder="Enter text..."
                style={{
                  color: block.style?.textColor,
                  fontSize: `${block.style?.fontSize}px`,
                  textAlign: block.style?.textAlign,
                  fontFamily: block.style?.fontFamily,
                  // Removed pre-wrap from Quill style to avoid layout issues (Quill handles it internally)
                }}
              />
            </div>
          )}
        </div>
      );
    }

    // INPUT (Original implementation, no StyleControls added as per new code)
    if (block.type === "input")
      return (
        <input
          className="w-full border p-3 border-gray-200 rounded-md"
          placeholder={block.placeholder}
        />
      );

    // BANNER
    if (block.type === "banner") {
      return (
        <div style={getCommonStyles(block)}>
          {block.url ? (
            <img src={block.url} className="w-full rounded-xl shadow-sm mb-4" />
          ) : (
            !readOnly && <div className="w-full h-40 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-300 mb-4">
              Banner Preview
            </div>
          )}
          {!readOnly && (
            <div className="flex gap-4">
              <input
                id={`banner-upload-${block.id}`}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) update("url", URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor={`banner-upload-${block.id}`}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium text-center cursor-pointer hover:bg-blue-700 transition"
              >
                Upload Banner Image
              </label>
            </div>
          )}
          {!readOnly && (
            <div className="mt-4">
              <input
                className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm"
                placeholder="Or enter Image URL..."
                value={block.url || ""}
                onChange={(e) => update("url", e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    // FEATURE GRID (Make a Note style)
    if (block.type === "featureGrid") {
      return (
        <div style={getCommonStyles(block)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {(block.items || []).map((item, idx) => (
              <div key={idx} className={`p-3 rounded-xl border border-gray-100 relative group ${readOnly ? "" : "hover:border-blue-200"}`}>
                {readOnly ? (
                  <>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter w-full outline-none">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800 w-full outline-none mt-1">{item.value}</div>
                  </>
                ) : (
                  <>
                    <input
                      className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter w-full outline-none"
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[idx].label = e.target.value;
                        update("items", newItems);
                      }}
                    />
                    <input
                      className="text-sm font-semibold text-gray-800 w-full outline-none mt-1"
                      value={item.value}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[idx].value = e.target.value;
                        update("items", newItems);
                      }}
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      onClick={() => {
                        const newItems = block.items.filter((_, i) => i !== idx);
                        update("items", newItems);
                      }}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readOnly && (
              <button
                onClick={() => update("items", [...block.items, { label: "Label", value: "Value" }])}
                className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition"
              >
                + Add Item
              </button>
            )}
          </div>
        </div>
      );
    }

    // SOCIAL LINKS
    if (block.type === "socialLinks") {
      return (
        <div style={getCommonStyles(block)}>
          <div className="flex gap-4 justify-center flex-wrap mb-4">
            {(block.links || []).map((link, idx) => (
              <div key={idx} className={`bg-white p-2 rounded-lg border border-gray-200 flex flex-col gap-2 min-w-[120px] relative group ${readOnly ? "" : "hover:border-blue-200"}`}>
                {readOnly ? (
                  <>
                    <div className="text-[10px] font-bold outline-none border rounded p-1 uppercase bg-gray-50">{link.platform}</div>
                    <div className="text-[10px] outline-none border rounded p-1 text-blue-600 truncate max-w-[120px]">{link.url}</div>
                  </>
                ) : (
                  <>
                    <select
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...block.links];
                        newLinks[idx].platform = e.target.value;
                        update("links", newLinks);
                      }}
                      className="text-[10px] font-bold outline-none border rounded p-1 uppercase"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="youtube">YouTube</option>
                      <option value="website">Website</option>
                    </select>
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...block.links];
                        newLinks[idx].url = e.target.value;
                        update("links", newLinks);
                      }}
                      className="text-[10px] outline-none border rounded p-1"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      onClick={() => {
                        const newLinks = block.links.filter((_, i) => i !== idx);
                        update("links", newLinks);
                      }}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readOnly && (
              <button
                onClick={() => update("links", [...block.links, { platform: "facebook", url: "https://" }])}
                className="border-2 border-dashed border-gray-200 rounded-lg p-2 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition text-xs"
              >
                + Social
              </button>
            )}
          </div>
        </div>
      );
    }

    // NAVIGATION
    if (block.type === "navigation") {
      return (
        <div style={getCommonStyles(block)}>
          <div className="flex gap-4 justify-center flex-wrap mb-4">
            {(block.links || []).map((link, idx) => (
              <div key={idx} className={`flex gap-2 bg-white p-2 rounded-lg border border-gray-200 relative group ${readOnly ? "" : "hover:border-blue-200"}`}>
                {readOnly ? (
                  <>
                    <div className="text-xs font-bold font-semibold outline-none border rounded p-1 w-20 bg-gray-50">{link.label}</div>
                    <div className="text-[10px] outline-none border rounded p-1 w-24 text-blue-600 truncate">{link.url}</div>
                  </>
                ) : (
                  <>
                    <input
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...block.links];
                        newLinks[idx].label = e.target.value;
                        update("links", newLinks);
                      }}
                      className="text-xs font-bold font-semibold outline-none border rounded p-1 w-20"
                    />
                    <input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...block.links];
                        newLinks[idx].url = e.target.value;
                        update("links", newLinks);
                      }}
                      className="text-[10px] outline-none border rounded p-1 w-24"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      onClick={() => {
                        const newLinks = block.links.filter((_, i) => i !== idx);
                        update("links", newLinks);
                      }}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readOnly && (
              <button
                onClick={() => update("links", [...block.links, { label: "Link", url: "#" }])}
                className="border-2 border-dashed border-gray-200 rounded-lg p-2 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition text-xs"
              >
                + Link
              </button>
            )}
          </div>
        </div>
      );
    }

    // DIVIDER
    if (block.type === "divider") {
      return (
        <div style={getCommonStyles(block)}>
          <hr className="border-t-2 border-gray-100" />
        </div>
      );
    }

    // ACCORDION
    if (block.type === "accordion") {
      return (
        <div style={getCommonStyles(block)}>
          <div className="space-y-3 mb-4">
            {(block.items || []).map((item, idx) => (
              <div key={idx} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group ${readOnly ? "" : "hover:border-blue-200"}`}>
                {readOnly ? (
                  <>
                    <div className="text-sm font-bold w-full outline-none mb-2 border-b border-gray-50 pb-1 resize-none overflow-hidden whitespace-pre-wrap break-words">{item.title}</div>
                    <div className="text-xs text-gray-500 w-full outline-none resize-none min-h-[60px] whitespace-pre-wrap break-words overflow-hidden">{item.content}</div>
                  </>
                ) : (
                  <>
                    <textarea
                      className="text-sm font-bold w-full outline-none mb-2 border-b border-gray-50 pb-1 resize-none overflow-hidden whitespace-pre-wrap break-words"
                      placeholder="Item Title"
                      value={item.title}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[idx].title = e.target.value;
                        update("items", newItems);
                      }}
                    />
                    <textarea
                      className="text-xs text-gray-500 w-full outline-none resize-none min-h-[60px] whitespace-pre-wrap break-words overflow-hidden"
                      placeholder="Item Content"
                      value={item.content}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[idx].content = e.target.value;
                        update("items", newItems);
                      }}
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      onClick={() => {
                        const newItems = block.items.filter((_, i) => i !== idx);
                        update("items", newItems);
                      }}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readOnly && (
              <button
                onClick={() => update("items", [...block.items, { title: "Title", content: "Content" }])}
                className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition w-full text-sm"
              >
                + Add Accordion Item
              </button>
            )}
          </div>
        </div>
      );
    }

    // IMAGE (Original implementation with style support)
    if (block.type === "image") {
      return (
        <div style={getCommonStyles(block)}>
          {block.url && (
            <img
              src={block.url}
              className="w-full max-h-96 object-contain rounded-xl mb-4"
            />
          )}
          {!readOnly && (
            <>
              <input
                id={`image-upload-${block.id}`}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) update("url", URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor={`image-upload-${block.id}`}
                className="flex items-center justify-center gap-2 cursor-pointer
            rounded-xl border-2 border-dashed border-gray-300
            px-6 py-4 text-gray-600 mb-4
            hover:border-blue-500 hover:text-blue-600
            transition-all duration-200"
              >
                Click to upload image
              </label>
            </>
          )}
        </div>
      );
    }

    // BUTTON
    if (block.type === "btn") {
      return (
        <div>
          <button
            className="px-8 py-3 rounded-full transition-transform hover:scale-105"
            style={{
              backgroundColor: block.style?.backgroundColor === "transparent" ? "#237FEA" : (block.style?.backgroundColor || "#237FEA"),
              color: block.style?.textColor || "#ffffff",
              fontSize: block.style?.fontSize,
              borderRadius: block.style?.borderRadius,
              fontFamily: block.style?.fontFamily,
              pointerEvents: readOnly ? "none" : "auto"
            }}
          >
            {block.content}
          </button>
          {!readOnly && (
            <div className="mt-4">
              <input
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Button Text"
                value={block.content}
                onChange={(e) => update("content", e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    // SECTION GRID (Remaining original functionality)
    if (block.type === "sectionGrid")
      return (
        <div style={getCommonStyles(block)}>
          <div className={`grid gap-4 grid-cols-${block.columns.length}`}>
            {block.columns.map((col, i) => (
              <div key={i} className={`border-2 border-dashed border-gray-100 rounded-2xl p-4 bg-white/50 ${!readOnly ? "hover:border-blue-200" : ""}`}>
                {!readOnly && (
                  <div className="flex gap-2 mb-3">
                    {["text", "image", "btn"].map((t) => (
                      <button
                        key={t}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        onClick={() => addChild(i, t)}
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                )}
                {col.map((child) => (
                  <div key={child.id} className={`mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-50 relative group ${!readOnly ? "hover:scale-[1.01]" : ""}`}>
                    {!readOnly && (
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                        onClick={() => removeChild(i, child.id)}
                      >
                        ×
                      </button>
                    )}
                    {child.type === "text" && (
                      readOnly ? (
                        <p
                          style={{
                            color: child.style?.textColor,
                            fontSize: child.style?.fontSize,
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word"
                          }}
                        >
                          {child.content}
                        </p>
                      ) : (
                        <VariableTextarea
                          className="w-full outline-none text-sm resize-none bg-transparent whitespace-pre-wrap break-words overflow-hidden"
                          placeholder="Write here..."
                          value={child.content}
                          onChange={(e) => updateChild(i, child.id, "content", e.target.value)}
                        />
                      )
                    )}
                    {child.type === "image" && (
                      <div>
                        {child.url && <img src={child.url} className="w-full h-32 mb-2 rounded-lg object-cover" />}
                        {!readOnly && (
                          <>
                            <input
                              id={`child-upload-${child.id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateChild(i, child.id, "url", URL.createObjectURL(file));
                              }}
                            />
                            <label htmlFor={`child-upload-${child.id}`} className="text-[10px] text-blue-500 cursor-pointer hover:underline">
                              Upload Photo
                            </label>
                          </>
                        )}
                      </div>
                    )}
                    {child.type === "btn" && (
                      <div className="flex flex-col gap-2">
                        <button className="bg-blue-600 text-white px-4 py-1 rounded text-xs">
                          {child.content || "Button"}
                        </button>
                        {!readOnly && (
                          <input
                            className="text-[10px] border px-1 outline-none rounded"
                            placeholder="Label"
                            value={child.content}
                            onChange={(e) => updateChild(i, child.id, "content", e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );

    // CARD ROW
    if (block.type === "cardRow") {
      return (
        <div style={{
          ...getCommonStyles(block),
          display: block.style?.display || "flex",
          flexDirection: block.style?.flexDirection || "row",
          flexWrap: "wrap",
          gap: `${block.style?.gap || 20}px`,
          alignItems: block.style?.alignItems || "stretch",
          justifyContent: block.style?.justifyContent || "start",
        }}>
          {(block.cards || []).map((card) => (
            <div key={card.id} className={`relative group/card flex-1 min-w-[200px] ${readOnly ? "" : "hover:shadow-md"}`} style={{
              backgroundColor: card.style?.backgroundColor,
              borderRadius: card.style?.borderRadius,
              padding: card.style?.padding,
              border: "1px solid #eee"
            }}>
              {!readOnly && (
                <button
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition z-10"
                  onClick={() => removeCardFromRow(card.id)}
                >
                  ×
                </button>
              )}
              <div className="space-y-3">
                {card.url ? (
                  <img src={card.url} className="w-full rounded-lg object-cover h-32" />
                ) : (
                  <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px]">
                    Card Image
                  </div>
                )}
                {!readOnly && (
                  <>
                    <input
                      id={`card-row-upload-${card.id}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateCardInRow(card.id, "url", URL.createObjectURL(file));
                      }}
                    />
                    <label
                      htmlFor={`card-row-upload-${card.id}`}
                      className="block text-center text-blue-500 text-[10px] cursor-pointer hover:underline"
                    >
                      Upload Photo
                    </label>
                  </>
                )}

                {readOnly ? (
                  <>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                      {card.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#666", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                      {card.description}
                    </p>
                  </>
                ) : (
                  <>
                    <textarea
                      className="w-full bg-transparent outline-none font-bold text-sm resize-none overflow-hidden whitespace-pre-wrap break-words"
                      value={card.title}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      onChange={(e) => updateCardInRow(card.id, "title", e.target.value)}
                    />
                    <textarea
                      className="w-full bg-transparent outline-none text-[10px] text-gray-500 resize-none min-h-[40px] whitespace-pre-wrap break-words overflow-hidden"
                      value={card.description}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      onChange={(e) => updateCardInRow(card.id, "description", e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {!readOnly && (
            <div className="flex items-center justify-center min-w-[100px]">
              <button
                onClick={addCardToRow}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition flex items-center justify-center gap-2 text-sm"
              >
                + Add Card
              </button>
            </div>
          )}

        </div>
      );
    }

    // ✅ HERO SECTION (Wavy)
    if (block.type === "heroSection") {
      return (
        <div style={getCommonStyles(block)} className="relative overflow-hidden group">
          <div style={{
            padding: `${block.style?.padding || 0}px ${block.style?.padding || 0}px 100px`, // extra space for wave
            textAlign: "center",
            color: block.style?.textColor,
          }}>
            {/* BG Controls */}
            {!readOnly && (
              <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition">
                <input
                  id={`hero-bg-${block.id}`}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) update("backgroundImage", URL.createObjectURL(file));
                  }}
                />
                <label htmlFor={`hero-bg-${block.id}`} className="bg-white/80 text-black p-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-white transition">
                  Change BG
                </label>
              </div>
            )}

            {/* Content */}
            <div className="max-w-lg text-left ps-10 mx-auto relative z-10">
              {/* Logo Placeholder */}
              <div className="mb-6 flex items-center justify-start  mt-5">
                <img src="/DashboardIcons/sss-logo.png" className="w-[60px]" alt="" />
              </div>


              {readOnly ? (
                <h1 style={{ color: "white", lineHeight: "1.2", fontSize: "2.25rem", fontWeight: "600", textAlign: "left", whiteSpace: "pre-wrap", overflowWrap: "break-word", margin: 0 }}>
                  {block.title}
                </h1>
              ) : (
                <textarea
                  className="w-full bg-transparent text-white leading-10 text-4xl font-semibold text-start outline-none resize-none overflow-hidden"
                  value={block.title}
                  onChange={(e) => update("title", e.target.value)}
                  style={{ color: "inherit" }}
                />
              )}

              {readOnly ? (
                <p style={{ color: "white", fontSize: "1.125rem", fontWeight: "500", textAlign: "start", whiteSpace: "pre-wrap", overflowWrap: "break-word", marginTop: "1rem" }}>
                  {block.subtitle}
                </p>
              ) : (
                <textarea
                  className="w-full bg-transparent text-white text-lg font-medium text-start outline-none mt-4 resize-none overflow-hidden opacity-90"
                  value={block.subtitle}
                  onChange={(e) => update("subtitle", e.target.value)}
                  style={{ color: "inherit" }}
                />
              )}

              <div className="mt-8 flex justify-end ">
                {readOnly ? (
                  <button className="bg-yellow-400 w-auto text-black px-4 py-2 rounded-full shadow-lg" style={{ pointerEvents: 'none' }}>
                    {block.buttonText}
                  </button>
                ) : (
                  <input
                    className="bg-yellow-400 w-max text-black px-2 py-3 rounded-full outline-none text-center cursor-pointer hover:scale-105 transition transform shadow-lg"
                    value={block.buttonText}
                    onChange={(e) => update("buttonText", e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* WAVE SVG */}
          <div className="absolute bottom-0 left-0 w-full leading-none">
            <svg viewBox="0 0 1440 320" className="w-full h-auto block" style={{ transform: "translateY(5px)" }}>
              <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      );
    }

    // ✅ INFO BOX
    if (block.type === "infoBox") {
      return (


        <div style={{
          backgroundColor: block.style?.backgroundColor,
          borderRadius: block.style?.borderRadius,
          border: `${block.style?.borderWidth || 0}px solid ${block.style?.borderColor || "transparent"}`,
          padding: "20px",
          display: "grid",
          borderTop: "2px solid green",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          gridTemplateColumns: `repeat(${(block.items || []).length > 0 ? (block.items || []).length : 1}, 1fr)`,
          gap: "10px",
        }}>
          {(block.items || []).map((item, i) => (
            <div key={i} className={`text-center group  relative ${readOnly ? "" : ""}`}>
              {!readOnly && (
                <button
                  onClick={() => {
                    const newItems = block.items.filter((_, idx) => idx !== i);
                    update("items", newItems);
                  }}
                  className="absolute -top-3 right-0 text-red-500 text-xs opacity-0 group-hover:opacity-100"
                >✕</button>
              )}
              {readOnly ? (
                <>
                  <div className="block w-full text-xs font-bold text-gray-800 text-start mb-1">{item.label}</div>
                  <div className="mt-1 text-sm text-start">{item.value ? <div dangerouslySetInnerHTML={{ __html: item.value }} /> : null}</div>
                </>
              ) : (
                <>

                  <div className="text-editor-container grid  mt-1">
                    <input
                      value={item.label || ""}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[i].label = e.target.value;
                        update("items", newItems);
                      }}
                      className="text-xs focus:outline-none"
                      placeholder="Label"
                    />
                    <input
                      value={item.value || ""}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[i].value = e.target.value;
                        update("items", newItems);
                      }}
                      className="text-xs focus:outline-none"
                      placeholder="Value"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          {!readOnly && (
            <button
              onClick={() => update("items", [...block.items, { label: "Label", value: "Value" }])}
              className="text-xl font-bold text-gray-400 hover:text-blue-500"
            >
              +
            </button>
          )}
        </div>
      );
    }

    // ✅ VIDEO GRID
    if (block.type === "videoGrid") {
      return (
        <div style={getCommonStyles(block)}>
          <div className="grid grid-cols-2 gap-6">
            {(block.items || []).map((item, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center cursor-pointer hover:opacity-90 transition">
                {/* Thumbnail */}
                {item.thumbnail ? (
                  <img src={item.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <FaImage className="text-gray-600 text-4xl" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                  <FaPlay className="text-white ml-1" />
                </div>

                {/* Controls */}
                {!readOnly && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition z-20">
                    <input
                      className="flex-1 bg-transparent text-white text-xs outline-none"
                      placeholder="Video Title"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[i].title = e.target.value;
                        update("items", newItems);
                      }}
                    />
                    <label className="text-white text-xs underline cursor-pointer">
                      Img
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const newItems = [...block.items];
                            newItems[i].thumbnail = URL.createObjectURL(file);
                            update("items", newItems);
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => {
                        const newItems = block.items.filter((_, idx) => idx !== i);
                        update("items", newItems);
                      }}
                      className="text-red-400 font-bold"
                    >✕</button>
                  </div>
                )}
              </div>
            ))}
            {!readOnly && (
              <div
                onClick={() => update("items", [...(block.items || []), { title: "New Video", thumbnail: "" }])}
                className="aspect-video rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-blue-400 hover:text-blue-400 transition"
              >
                + Add Video
              </div>
            )}
          </div>
        </div>
      );
    }

    // ✅ WAVE FOOTER


    // ✅ WAVE FOOTER
    if (block.type === "waveFooter") {
      return (
        <div style={getCommonStyles(block)} className="relative group">
          <div className="absolute top-0 left-0 w-full leading-none transform -translate-y-full">
            <svg viewBox="0 0 1440 320" className="w-full h-auto block">
              <path
                fill={block.style?.backgroundColor || "transparent"}
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="text-center py-10 relative z-10" style={{ color: block.style?.textColor }}>
            {readOnly ? (
              <div dangerouslySetInnerHTML={{ __html: block.content || "© 2026 Your Company" }} />
            ) : (
              <VariableTextarea
                className="w-full bg-transparent text-center outline-none resize-none"
                value={block.content}
                onChange={(e) => update("content", e.target.value)}
              />
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const content = renderContent();

  if (readOnly) return content;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`relative cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 rounded-lg shadow-lg z-20' : 'hover:ring-1 hover:ring-blue-100'}`}
    >
      {content}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-30 animate-pulse">
          Editing
        </div>
      )}
    </div>
  );
}
