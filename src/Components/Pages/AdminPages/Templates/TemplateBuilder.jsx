import React, { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import {
  FaFont, FaHeading, FaImage, FaRegImage, FaMousePointer, FaColumns,
  FaList, FaShareAlt, FaCompass, FaMinus, FaChevronCircleDown,
  FaIdCard, FaLayerGroup, FaMagic, FaStar, FaInfoCircle, FaVideo
} from "react-icons/fa";

import BlockRenderer, { AdvancedStyleControls } from "./BlockRenderer";
import PreviewModal from "./PreviewModal";

export default function TemplateBuilder({
  blocks,
  setBlocks,
  subject,
  setSubject,
  isPreview,
  setIsPreview
}) {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("blocks"); // "blocks" or "settings"

  useEffect(() => {
    if (selectedBlockId) {
      setSidebarTab("settings");
    }
  }, [selectedBlockId]);

  const updateStyle = (key, value) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId
          ? { ...b, style: { ...(b.style || {}), [key]: value } }
          : b
      )
    );
  };


  const sidebarBlocks = [
    { id: "text", label: "Text field", icon: <FaFont /> },
    { id: "heading", label: "Heading", icon: <FaHeading /> },
    { id: "banner", label: "Banner/Header", icon: <FaImage /> },
    { id: "image", label: "Image", icon: <FaRegImage /> },
    { id: "btn", label: "Button", icon: <FaMousePointer /> },
    { id: "sectionGrid", label: "Section Grid", icon: <FaColumns /> },
    { id: "featureGrid", label: "Feature Grid", icon: <FaList /> },
    { id: "socialLinks", label: "Social Links", icon: <FaShareAlt /> },
    { id: "navigation", label: "Navigation", icon: <FaCompass /> },
    { id: "divider", label: "Divider", icon: <FaMinus /> },
    { id: "accordion", label: "Accordion", icon: <FaChevronCircleDown /> },
    { id: "card", label: "Card", icon: <FaIdCard /> },
    { id: "cardRow", label: "Cards in Row", icon: <FaLayerGroup /> },
    { id: "customSection", label: "Custom Section", icon: <FaMagic /> },
    { id: "heroSection", label: "Hero (Wavy)", icon: <FaStar /> },
    { id: "infoBox", label: "Info Box", icon: <FaInfoCircle /> },
    { id: "videoGrid", label: "Video Grid", icon: <FaVideo /> },
  ];

  const addBlock = async (type, columnCount = 2) => {
    const defaultStyle = {
      backgroundColor: "transparent",
      textColor: "#000000",
      fontSize: 16,
      textAlign: "left",
      padding: 10,
      borderRadius: 0,
      fontWeight: "normal",
      borderWidth: 0,
      borderColor: "#000000",
      width: "100%",
      height: "auto",
      fontFamily: "inherit",
      maxWidth: "100%",
      marginTop: 0,
      marginBottom: 20,
      backgroundImage: "",
      display: "block",
      flexDirection: "row",
      gap: 0,
      alignItems: "stretch",
      justifyContent: "start",
      boxShadow: "none",
    };

    const newBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
      url: "",
      placeholder: "Enter value",
      style: { ...defaultStyle },
      items: [], // For grids, lists, or accordions
      links: [], // For social/nav
      title: "", // For Card
      description: "", // For Card
      children: [], // For Custom Section
      backgroundImage: "", // For Custom Section
    };

    // Type-specific adjustments
    if (type === "heading") {
      newBlock.style.fontSize = 24;
      newBlock.style.fontWeight = "bold";
      newBlock.placeholder = "Enter Heading";
    } else if (type === "customSection") {
      newBlock.style.padding = 40;
      newBlock.style.textAlign = "center";
    } else if (type === "card") {
      newBlock.title = "Card Title";
      newBlock.description = "Card description goes here.";
      newBlock.style.backgroundColor = "#ffffff";
      newBlock.style.borderRadius = 12;
      newBlock.style.padding = 20;
    } else if (type === "banner") {
      newBlock.style.padding = 0;
    } else if (type === "btn") {
      newBlock.style.backgroundColor = "#237FEA";
      newBlock.style.textColor = "#ffffff";
      newBlock.style.borderRadius = 8;
      newBlock.style.textAlign = "center";
      newBlock.content = "Click Here";
    } else if (type === "sectionGrid") {
      newBlock.columns = Array(columnCount).fill(null).map(() => []);
    } else if (type === "featureGrid") {
      newBlock.style.backgroundColor = "#f9f9f9";
      newBlock.style.borderRadius = 12;
      newBlock.items = [
        { label: "Name", value: "John Doe" },
        { label: "Date", value: "2024-01-01" }
      ];
    } else if (type === "accordion") {
      newBlock.items = [
        { title: "Question 1", content: "Answer 1" },
        { title: "Question 2", content: "Answer 2" }
      ];
    } else if (type === "socialLinks") {
      newBlock.style.textAlign = "center";
      newBlock.links = [
        { platform: "facebook", url: "https://facebook.com" },
        { platform: "instagram", url: "https://instagram.com" }
      ];
    } else if (type === "navigation") {
      newBlock.style.textAlign = "center";
      newBlock.links = [
        { label: "Home", url: "/" },
        { label: "About", url: "/about" }
      ];
    } else if (type === "divider") {
      newBlock.style.padding = 20;
    } else if (type === "cardRow") {
      newBlock.style.display = "flex";
      newBlock.style.flexDirection = "row";
      newBlock.style.gap = 20;
      newBlock.style.justifyContent = "start";
      newBlock.cards = [
        { id: crypto.randomUUID(), title: "Card 1", description: "Description 1", url: "", style: { backgroundColor: "#ffffff", borderRadius: 12, padding: 20 } },
        { id: crypto.randomUUID(), title: "Card 2", description: "Description 2", url: "", style: { backgroundColor: "#ffffff", borderRadius: 12, padding: 20 } }
      ];
    }

    setBlocks((prev) => [...prev, newBlock]);
  };


  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const duplicateBlock = (id) => {
    const block = blocks.find((b) => b.id === id);

    // ✅ deep clone (break shared references)
    const clonedBlock = JSON.parse(JSON.stringify(block));

    // ✅ assign brand new IDs
    const regenerateIds = (blk) => {
      blk.id = crypto.randomUUID();

      // sectionGrid → regenerate child IDs
      if (blk.type === "sectionGrid" && Array.isArray(blk.columns)) {
        blk.columns = blk.columns.map((column) =>
          column.map((child) => {
            const clonedChild = { ...child };
            regenerateIds(clonedChild);
            return clonedChild;
          })
        );
      }

      // cardRow → regenerate child card IDs
      if (blk.type === "cardRow" && Array.isArray(blk.cards)) {
        blk.cards = blk.cards.map((card) => ({
          ...card,
          id: crypto.randomUUID()
        }));
      }
    };

    regenerateIds(clonedBlock);

    setBlocks((prev) => [...prev, clonedBlock]);
  };


  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setBlocks(items);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Canvas */}
      <div
        className="w-10/12 p-6 border-r border-gray-200 overflow-y-auto"
        style={{ maxHeight: '100vh' }}
        onClick={() => setSelectedBlockId(null)}
      >
        <div className="mb-6">
          <label className="font-medium text-gray-700">Subject line</label>
          <input
            className="w-full border border-gray-200 px-4 py-2 rounded-lg mt-1"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject..."
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {blocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        {/* Block header */}
                        <div className="flex justify-between mb-2 text-sm">
                          <div {...provided.dragHandleProps} className="cursor-grab text-gray-500">
                            ⠿
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => duplicateBlock(block.id)}
                              className="px-2 py-1 text-white  bg-[#237FEA] rounded-xl"
                            >
                              Duplicate
                            </button>

                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="px-2 py-1 text-white   bg-red-500 rounded-xl"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Block Body */}
                        <BlockRenderer
                          block={block}
                          blocks={blocks}
                          setBlocks={setBlocks}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </div>
      <div
        className="p-4 w-3/12 bg-white flex flex-col border-l border-gray-200 shadow-xl z-30 overflow-y-auto"
        style={{ maxHeight: '100vh', position: 'sticky', top: 0 }}
      >
        {/* Sidebar Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setSidebarTab("blocks")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${sidebarTab === "blocks" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            Blocks
          </button>
          <button
            onClick={() => setSidebarTab("settings")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${sidebarTab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            Settings
          </button>
        </div>

        {sidebarTab === "blocks" ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Layout Presets */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm text-gray-400 uppercase mb-4 tracking-widest">Layouts</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "1 Column", cols: 1 },
                  { label: "2 Columns", cols: 2 },
                  { label: "3 Columns", cols: 3 },
                  { label: "4 Columns", cols: 4 },
                ].map((layout) => (
                  <button
                    key={layout.label}
                    onClick={() => addBlock("sectionGrid", layout.cols)}
                    className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="w-10 h-7 rounded bg-white border border-gray-200 flex gap-0.5 p-0.5 mb-2 group-hover:border-blue-200 transition">
                      {Array(layout.cols).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 bg-gray-200 rounded-sm group-hover:bg-blue-200 transition" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600 uppercase">{layout.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <h3 className="font-semibold text-sm text-gray-400 uppercase mb-4 tracking-widest">Available Blocks</h3>
            <div className="grid grid-cols-1 gap-2">
              {sidebarBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => addBlock(block.id)}
                  className="px-4 py-3 rounded-xl cursor-pointer bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center gap-3 group"
                >
                  <span className="text-gray-400 text-lg group-hover:text-blue-600 transition-colors">{block.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 flex-1">{block.label}</span>
                  <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition text-lg">+</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-semibold text-sm text-gray-400 uppercase mb-4 tracking-widest">Variables</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "First Name", value: "{FirstName}" },
                  { label: "Last Name", value: "{LastName}" },
                  { label: "Company", value: "{Company}" },
                  { label: "Link", value: "{Link}" },
                ].map((v) => (
                  <div
                    key={v.value}
                    onClick={() => {
                      navigator.clipboard.writeText(v.value);
                      alert(`Copied ${v.value} to clipboard!`);
                    }}
                    className="px-3 py-2 rounded-lg cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium border border-blue-100 flex justify-between items-center"
                  >
                    <span>{v.label}</span>
                    <span className="text-[10px] bg-white px-1 rounded border shadow-sm">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">
            {selectedBlockId ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-widest">Edit Block</h3>
                  <button
                    onClick={() => setSelectedBlockId(null)}
                    className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase transition"
                  >
                    Close
                  </button>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-6 font-medium text-xs text-blue-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Editing: {blocks.find(b => b.id === selectedBlockId)?.type.toUpperCase()}
                </div>
                <AdvancedStyleControls
                  block={blocks.find(b => b.id === selectedBlockId)}
                  updateStyle={updateStyle}
                />
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <div className="mb-4 text-4xl">🖱️</div>
                <p className="text-sm">Click on any block in the canvas to edit its properties.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}


    </div>
  );
}
