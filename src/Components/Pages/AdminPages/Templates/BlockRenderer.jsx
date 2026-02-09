import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function BlockRenderer({ block, blocks, setBlocks }) {
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

  const StyleControls = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl mt-4 border border-gray-100">
      {/* Colors */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Text Color</label>
        <input
          type="color"
          className="w-8 h-8 rounded-lg cursor-pointer border-none p-0"
          value={block.style?.textColor || "#000000"}
          onChange={(e) => updateStyle("textColor", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BG Color</label>
        <input
          type="color"
          className="w-8 h-8 rounded-lg cursor-pointer border-none p-0"
          value={block.style?.backgroundColor || "transparent"}
          onChange={(e) => updateStyle("backgroundColor", e.target.value)}
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col gap-1 min-w-[100px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Font Size ({block.style?.fontSize}px)</label>
        <input
          type="range"
          min="12"
          max="72"
          value={block.style?.fontSize || 16}
          onChange={(e) => updateStyle("fontSize", parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weight</label>
        <select
          value={block.style?.fontWeight || "normal"}
          onChange={(e) => updateStyle("fontWeight", e.target.value)}
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi-Bold</option>
          <option value="700">Bold</option>
          <option value="900">Extra-Bold</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 min-w-[100px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Font Family</label>
        <select
          value={block.style?.fontFamily || "inherit"}
          onChange={(e) => updateStyle("fontFamily", e.target.value)}
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
        >
          <option value="inherit">Default</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Outfit', sans-serif">Outfit</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Courier New', monospace">Courier</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Align</label>
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200">
          {["left", "center", "right", "justify"].map((align) => (
            <button
              key={align}
              onClick={() => updateStyle("textAlign", align)}
              className={`p-1 rounded ${block.style?.textAlign === align ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              {align === "left" && "L"}
              {align === "center" && "C"}
              {align === "right" && "R"}
              {align === "justify" && "J"}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing & Borders */}
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Padding ({block.style?.padding}px)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={block.style?.padding || 0}
          onChange={(e) => updateStyle("padding", parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Radius ({block.style?.borderRadius}px)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={block.style?.borderRadius || 0}
          onChange={(e) => updateStyle("borderRadius", parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Margins (T/B)</label>
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="Top"
            className="w-12 text-[10px] border rounded p-1"
            value={block.style?.marginTop}
            onChange={(e) => updateStyle("marginTop", parseInt(e.target.value))}
          />
          <input
            type="number"
            placeholder="Btm"
            className="w-12 text-[10px] border rounded p-1"
            value={block.style?.marginBottom}
            onChange={(e) => updateStyle("marginBottom", parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bord Width ({block.style?.borderWidth}px)</label>
        <input
          type="range"
          min="0"
          max="20"
          value={block.style?.borderWidth || 0}
          onChange={(e) => updateStyle("borderWidth", parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bord Color</label>
        <input
          type="color"
          className="w-8 h-8 rounded-lg cursor-pointer border-none p-0"
          value={block.style?.borderColor || "#000000"}
          onChange={(e) => updateStyle("borderColor", e.target.value)}
        />
      </div>

      {/* Dimensions */}
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Width ({block.style?.width})</label>
        <select
          value={block.style?.width || "100%"}
          onChange={(e) => updateStyle("width", e.target.value)}
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
        >
          <option value="100%">100%</option>
          <option value="75%">75%</option>
          <option value="50%">50%</option>
          <option value="25%">25%</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Width</label>
        <input
          placeholder="e.g. 600px"
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8 w-20"
          value={block.style?.maxWidth || "100%"}
          onChange={(e) => updateStyle("maxWidth", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Height ({block.style?.height})</label>
        <input
          placeholder="e.g. 200px"
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8 w-20"
          value={block.style?.height || "auto"}
          onChange={(e) => updateStyle("height", e.target.value)}
        />
      </div>
      {/* Layout & Display */}
      <div className="flex flex-col gap-1 min-w-[100px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Display</label>
        <select
          value={block.style?.display || "block"}
          onChange={(e) => updateStyle("display", e.target.value)}
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
        >
          <option value="block">Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="inline-block">Inline Block</option>
        </select>
      </div>

      {(block.style?.display === "flex" || block.style?.display === "grid") && (
        <>
          <div className="flex flex-col gap-1 min-w-[100px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gap ({block.style?.gap}px)</label>
            <input
              type="number"
              value={block.style?.gap || 0}
              onChange={(e) => updateStyle("gap", parseInt(e.target.value))}
              className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8 w-20"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[100px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Direction</label>
            <select
              value={block.style?.flexDirection || "row"}
              onChange={(e) => updateStyle("flexDirection", e.target.value)}
              className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[100px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Align Items</label>
            <select
              value={block.style?.alignItems || "stretch"}
              onChange={(e) => updateStyle("alignItems", e.target.value)}
              className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
            >
              <option value="stretch">Stretch</option>
              <option value="center">Center</option>
              <option value="flex-start">Start</option>
              <option value="flex-end">End</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[100px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Justify Content</label>
            <select
              value={block.style?.justifyContent || "start"}
              onChange={(e) => updateStyle("justifyContent", e.target.value)}
              className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="space-between">Between</option>
              <option value="space-around">Around</option>
            </select>
          </div>
        </>
      )}

      {/* Shadow */}
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Box Shadow</label>
        <input
          placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
          className="text-[10px] font-bold outline-none border rounded p-1 bg-white h-8"
          value={block.style?.boxShadow || ""}
          onChange={(e) => updateStyle("boxShadow", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[80px]">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BG Image</label>
        <div className="flex gap-1 items-center">
          <input
            id={`bg-style-upload-${block.id}`}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateStyle("backgroundImage", URL.createObjectURL(file));
            }}
          />
          <label htmlFor={`bg-style-upload-${block.id}`} className="bg-white border rounded p-1 text-[10px] font-bold cursor-pointer hover:bg-gray-50 flex items-center justify-center h-8 px-2">
            Upload
          </label>
          {block.style?.backgroundImage && (
            <button
              onClick={() => updateStyle("backgroundImage", "")}
              className="text-red-500 hover:text-red-700 font-bold text-xs px-1"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // CUSTOM SECTION
  if (block.type === "customSection") {
    return (
      <div style={{
        padding: block.style?.padding,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: block.style?.backgroundColor,
        borderRadius: block.style?.borderRadius,
        border: `${block.style?.borderWidth}px solid ${block.style?.borderColor}`,
        width: block.style?.width || "100%",
        maxWidth: block.style?.maxWidth || "100%",
        height: block.style?.height || "auto",
        marginTop: block.style?.marginTop,
        marginBottom: block.style?.marginBottom,
        fontFamily: block.style?.fontFamily,
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }} className="relative min-h-[300px] flex flex-col justify-center overflow-hidden">
        {/* BG Upload Overlay */}
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

        {/* Children Management */}
        <div className="flex flex-col gap-6 relative z-10">
          {(block.children || []).map((child) => (
            <div key={child.id} className="relative group/child p-2 border border-transparent hover:border-blue-200 rounded-lg transition">
              <button
                className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/child:opacity-100 transition z-20"
                onClick={() => removeSectionChild(child.id)}
              >
                ×
              </button>
              {child.type === "heading" && (
                <input
                  className="w-full bg-transparent outline-none font-bold"
                  value={child.content}
                  onChange={(e) => updateSectionChild(child.id, "content", e.target.value)}
                  style={{
                    fontSize: child.style?.fontSize,
                    color: child.style?.textColor,
                    textAlign: child.style?.textAlign,
                    fontFamily: block.style?.fontFamily
                  }}
                />
              )}
              {child.type === "text" && (
                <textarea
                  className="w-full bg-transparent outline-none resize-none"
                  value={child.content}
                  onChange={(e) => updateSectionChild(child.id, "content", e.target.value)}
                  style={{
                    fontSize: child.style?.fontSize,
                    color: child.style?.textColor,
                    textAlign: child.style?.textAlign,
                    fontFamily: block.style?.fontFamily
                  }}
                />
              )}
              {child.type === "logo" && (
                <div style={{ textAlign: child.style?.textAlign }}>
                  {child.url ? (
                    <img src={child.url} className="mx-auto max-h-16 object-contain" />
                  ) : (
                    <div className="text-[10px] text-gray-400">Logo Placeholder</div>
                  )}
                  <input
                    id={`logo-upload-${child.id}`}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateSectionChild(child.id, "url", URL.createObjectURL(file));
                    }}
                  />
                  <label htmlFor={`logo-upload-${child.id}`} className="text-[10px] text-blue-500 cursor-pointer">Upload Logo</label>
                </div>
              )}
              {child.type === "button" && (
                <div style={{ textAlign: child.style?.textAlign }}>
                  <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold" style={{ backgroundColor: child.style?.backgroundColor }}>
                    {child.content}
                  </button>
                  <input
                    className="block mt-2 mx-auto text-[10px] border rounded p-1 outline-none"
                    value={child.content}
                    onChange={(e) => updateSectionChild(child.id, "content", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Add Child Menu */}
          <div className="flex justify-center gap-2 mt-4">
            {["heading", "text", "button", "logo"].map(t => (
              <button
                key={t}
                onClick={() => addSectionChild(t)}
                className="bg-white/50 hover:bg-white text-[10px] font-bold px-3 py-1 rounded-full border border-gray-200 transition"
              >
                + {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <StyleControls />
      </div>
    );
  }

  // CARD
  if (block.type === "card") {
    return (
      <div style={{
        padding: block.style?.padding,
        backgroundColor: block.style?.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: block.style?.borderRadius,
        border: `${block.style?.borderWidth}px solid ${block.style?.borderColor}`,
        width: block.style?.width,
        maxWidth: block.style?.maxWidth,
        height: block.style?.height,
        marginTop: block.style?.marginTop,
        marginBottom: block.style?.marginBottom,
        fontFamily: block.style?.fontFamily,
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <div className="space-y-4">
          {/* Image Part */}
          {block.url ? (
            <img src={block.url} className="w-full rounded-lg object-cover h-40" />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
              Card Image Preview
            </div>
          )}
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
            className="block text-center text-blue-500 text-xs cursor-pointer hover:underline"
          >
            Upload Photo
          </label>

          {/* Text Part */}
          <textarea
            className="w-full bg-transparent focus:outline-none border-b border-gray-100 font-bold text-lg resize-none overflow-hidden whitespace-pre-wrap break-words"
            placeholder="Card Title"
            value={block.title}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onChange={(e) => update("title", e.target.value)}
            style={{ color: block.style?.textColor, textAlign: block.style?.textAlign }}
          />
          <textarea
            className="w-full bg-transparent focus:outline-none text-sm text-gray-600 resize-none min-h-[60px] whitespace-pre-wrap break-words overflow-hidden"
            placeholder="Card description..."
            value={block.description}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onChange={(e) => update("description", e.target.value)}
            style={{ textAlign: block.style?.textAlign }}
          />
        </div>
        <StyleControls />
      </div>
    );
  }

  // HEADING
  if (block.type === "heading") {
    return (
      <div style={{
        backgroundColor: block.style?.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <textarea
          value={block.content}
          placeholder={block.placeholder}
          onChange={(e) => update("content", e.target.value)}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          className="w-full bg-transparent focus:outline-none border-b border-dashed border-gray-300 pb-1 resize-none overflow-hidden block"
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
        <StyleControls />
      </div>
    );
  }

  // TEXT / PARAGRAPH
  if (block.type === "text") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <div className="p-2 border border-dashed border-gray-200 rounded-lg min-h-[100px] bg-white text-editor-container">
          <ReactQuill
            theme="snow"
            value={block.content}
            onChange={(val) => update("content", val)}
            placeholder="Enter text..."
            style={{
              color: block.style.textColor,
              fontSize: `${block.style.fontSize}px`,
              textAlign: block.style.textAlign,
              fontFamily: block.style?.fontFamily,
              // Removed pre-wrap from Quill style to avoid layout issues (Quill handles it internally)
            }}
          />
        </div>
        <StyleControls />
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
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        {block.url ? (
          <img src={block.url} className="w-full rounded-xl shadow-sm mb-4" />
        ) : (
          <div className="w-full h-40 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-300 mb-4">
            Banner Preview
          </div>
        )}
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
        <div className="mt-4">
          <input
            className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm"
            placeholder="Or enter Image URL..."
            value={block.url || ""}
            onChange={(e) => update("url", e.target.value)}
          />
        </div>
        <StyleControls />
      </div>
    );
  }

  // FEATURE GRID (Make a Note style)
  if (block.type === "featureGrid") {
    return (
      <div style={{ padding: block.style.padding, backgroundColor: block.style.backgroundColor, borderRadius: block.style.borderRadius }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {block.items.map((item, idx) => (
            <div key={idx} className=" p-3 rounded-xl border border-gray-100 relative group">
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
            </div>
          ))}
          <button
            onClick={() => update("items", [...block.items, { label: "Label", value: "Value" }])}
            className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition"
          >
            + Add Item
          </button>
        </div>
        <StyleControls />
      </div>
    );
  }

  // SOCIAL LINKS
  if (block.type === "socialLinks") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        textAlign: block.style.textAlign,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <div className="flex gap-4 justify-center flex-wrap mb-4">
          {block.links.map((link, idx) => (
            <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 flex flex-col gap-2 min-w-[120px] relative group">
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
            </div>
          ))}
          <button
            onClick={() => update("links", [...block.links, { platform: "facebook", url: "https://" }])}
            className="border-2 border-dashed border-gray-200 rounded-lg p-2 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition text-xs"
          >
            + Social
          </button>
        </div>
        <StyleControls />
      </div>
    );
  }

  // NAVIGATION
  if (block.type === "navigation") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        textAlign: block.style.textAlign,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <div className="flex gap-4 justify-center flex-wrap mb-4">
          {block.links.map((link, idx) => (
            <div key={idx} className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200 relative group">
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
            </div>
          ))}
          <button
            onClick={() => update("links", [...block.links, { label: "Link", url: "#" }])}
            className="border-2 border-dashed border-gray-200 rounded-lg p-2 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition text-xs"
          >
            + Link
          </button>
        </div>
        <StyleControls />
      </div>
    );
  }

  // DIVIDER
  if (block.type === "divider") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <hr className="border-t-2 border-gray-100" />
        <StyleControls />
      </div>
    );
  }

  // ACCORDION
  if (block.type === "accordion") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <div className="space-y-3 mb-4">
          {block.items.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
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
            </div>
          ))}
          <button
            onClick={() => update("items", [...block.items, { title: "Title", content: "Content" }])}
            className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition w-full text-sm"
          >
            + Add Accordion Item
          </button>
        </div>
        <StyleControls />
      </div>
    );
  }

  // IMAGE (Original implementation with style support)
  if (block.type === "image") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        {block.url && (
          <img
            src={block.url}
            className="w-full max-h-96 object-contain rounded-xl mb-4"
          />
        )}
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
        <StyleControls />
      </div>
    );
  }

  // BUTTON
  if (block.type === "btn") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        textAlign: block.style.textAlign,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <button
          className="px-8 py-3 rounded-full transition-transform hover:scale-105"
          style={{
            backgroundColor: block.style.backgroundColor === "transparent" ? "#237FEA" : block.style.backgroundColor,
            color: block.style.textColor,
            fontSize: block.style.fontSize,
            borderRadius: block.style.borderRadius,
            fontFamily: block.style?.fontFamily,
          }}
        >
          {block.content}
        </button>
        <div className="mt-4">
          <input
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Button Text"
            value={block.content}
            onChange={(e) => update("content", e.target.value)}
          />
        </div>
        <StyleControls />
      </div>
    );
  }

  // SECTION GRID (Remaining original functionality)
  if (block.type === "sectionGrid")
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display,
        flexDirection: block.style?.flexDirection,
        gap: `${block.style?.gap}px`,
        alignItems: block.style?.alignItems,
        justifyContent: block.style?.justifyContent,
        boxShadow: block.style?.boxShadow,
      }}>
        <div className={`grid gap-4 grid-cols-${block.columns.length}`}>
          {block.columns.map((col, i) => (
            <div key={i} className="border-2 border-dashed border-gray-100 rounded-2xl p-4 bg-white/50">
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
              {col.map((child) => (
                <div key={child.id} className="mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-50 relative group">
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                    onClick={() => removeChild(i, child.id)}
                  >
                    ×
                  </button>
                  {child.type === "text" && (
                    <textarea
                      className="w-full outline-none text-sm resize-none bg-transparent whitespace-pre-wrap break-words overflow-hidden"
                      placeholder="Write here..."
                      value={child.content}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      onChange={(e) => updateChild(i, child.id, "content", e.target.value)}
                    />
                  )}
                  {child.type === "image" && (
                    <div>
                      {child.url && <img src={child.url} className="w-full h-32 mb-2 rounded-lg object-cover" />}
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
                    </div>
                  )}
                  {child.type === "btn" && (
                    <div className="flex flex-col gap-2">
                      <button className="bg-blue-600 text-white px-4 py-1 rounded text-xs">
                        {child.content || "Button"}
                      </button>
                      <input
                        className="text-[10px] border px-1 outline-none rounded"
                        placeholder="Label"
                        value={child.content}
                        onChange={(e) => updateChild(i, child.id, "content", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <StyleControls />
      </div>
    );

  // CARD ROW
  if (block.type === "cardRow") {
    return (
      <div style={{
        padding: block.style.padding,
        backgroundColor: block.style.backgroundColor,
        backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: block.style?.display || "flex",
        flexDirection: block.style?.flexDirection || "row",
        flexWrap: "wrap",
        gap: `${block.style?.gap || 20}px`,
        alignItems: block.style?.alignItems || "stretch",
        justifyContent: block.style?.justifyContent || "start",
        boxShadow: block.style?.boxShadow,
        width: "100%",
      }}>
        {(block.cards || []).map((card) => (
          <div key={card.id} className="relative group/card flex-1 min-w-[200px]" style={{
            backgroundColor: card.style?.backgroundColor,
            borderRadius: card.style?.borderRadius,
            padding: card.style?.padding,
            border: "1px solid #eee"
          }}>
            <button
              className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition z-10"
              onClick={() => removeCardFromRow(card.id)}
            >
              ×
            </button>
            <div className="space-y-3">
              {card.url ? (
                <img src={card.url} className="w-full rounded-lg object-cover h-32" />
              ) : (
                <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px]">
                  Card Image
                </div>
              )}
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
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center min-w-[100px]">
          <button
            onClick={addCardToRow}
            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition flex items-center justify-center gap-2 text-sm"
          >
            + Add Card
          </button>
        </div>

        <StyleControls />
      </div>
    );
  }

  return null;
}
