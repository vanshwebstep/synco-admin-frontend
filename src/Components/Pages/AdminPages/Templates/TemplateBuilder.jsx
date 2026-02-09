import React, { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import BlockRenderer from "./BlockRenderer";
import PreviewModal from "./PreviewModal";

export default function TemplateBuilder({
  blocks,
  setBlocks,
  subject,
  setSubject,
  isPreview,
  setIsPreview
}) {


  const sidebarBlocks = [
    { id: "text", label: "Text field" },
    { id: "heading", label: "Heading" },
    { id: "banner", label: "Banner/Header" },
    { id: "image", label: "Image" },
    { id: "btn", label: "Button" },
    { id: "sectionGrid", label: "Section Grid" },
    { id: "featureGrid", label: "Feature Grid (Note)" },
    { id: "socialLinks", label: "Social Links" },
    { id: "navigation", label: "Navigation" },
    { id: "divider", label: "Divider" },
    { id: "accordion", label: "Accordion" },
    { id: "card", label: "Card" },
    { id: "cardRow", label: "Cards in Row" },
    { id: "customSection", label: "Custom Section (BG)" },
  ];

  const addBlock = async (type) => {
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
      newBlock.columns = Array(2).fill(null).map(() => []);
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
      <div className="w-10/12 p-6 border-r border-gray-200">
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
        <div className="p-4 w-2/12 bg-white">
        <h3 className="font-semibold text-lg mb-3">Blocks</h3>

        <div className="space-y-2">
          {sidebarBlocks.map((block) => (
            <div
              key={block.id}
              onClick={() => addBlock(block.id)}
              className="px-3 py-2 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
            >
              {block.label}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}


    </div>
  );
}
