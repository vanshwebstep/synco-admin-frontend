import React, { useState, useCallback, useEffect } from "react";
import parse from "html-react-parser";
import { useCommunicationTemplate } from "../contexts/CommunicationContext";
import { useNavigate, useSearchParams } from "react-router-dom";  // ✅ to read URL params

export default function PreviewModal({ mode_of_communication, title, category, tags, sender, message, blocks, onClose, subject, editMode, templateId }) {
  const { createCommunicationTemplate, updateCommunicationTemplate } = useCommunicationTemplate();
  const navigate = useNavigate();

  const [previewData, setPreviewData] = useState({
    subject: subject || "",
    blocks: blocks.map(b => ({ ...b })) // clone to avoid mutating props
  });
  const convertBlobToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
    });
  };
  const convertNestedImages = async (blocks) => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // Top-level image
      if (block.type === "image" && block.url?.startsWith("blob")) {
        block.url = await convertBlobToBase64(block.url);
      }

      // SectionGrid children
      if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
        for (let ci = 0; ci < block.columns.length; ci++) {
          for (let c = 0; c < block.columns[ci].length; c++) {
            const child = block.columns[ci][c];
            if (child.type === "image" && child.url?.startsWith("blob")) {
              child.url = await convertBlobToBase64(child.url);
            }
          }
        }
      }

      // Custom Section (BG and Children)
      if (block.type === "customSection") {
        if (block.backgroundImage?.startsWith("blob")) {
          block.backgroundImage = await convertBlobToBase64(block.backgroundImage);
        }
        if (Array.isArray(block.children)) {
          for (let child of block.children) {
            if (child.type === "logo" && child.url?.startsWith("blob")) {
              child.url = await convertBlobToBase64(child.url);
            }
          }
        }
      }

      // CardRow images
      if (block.type === "cardRow" && Array.isArray(block.cards)) {
        for (let card of block.cards) {
          if (card.url?.startsWith("blob")) {
            card.url = await convertBlobToBase64(card.url);
          }
        }
      }
    }
    return blocks;
  };
  console.log('editMode', editMode)

  // ✅ Save final preview data
  const handleSavePreview = async () => {
    try {
      const formData = new FormData();

      // ✅ deep clone (DO NOT mutate React state)
      const finalBlocks = JSON.parse(JSON.stringify(previewData.blocks));

      let imageIndex = 1;

      const collectImages = async (block) => {
        if ((block.type === "image" || block.type === "banner" || block.type === "card") && block.url?.startsWith("blob")) {
          const response = await fetch(block.url);
          const blob = await response.blob();
          const fieldName = `image_${imageIndex}`;
          const file = new File([blob], `${fieldName}.png`, { type: blob.type });
          formData.append(fieldName, file);
          block.url = fieldName;
          imageIndex++;
        }

        if (block.type === "customSection" && block.backgroundImage?.startsWith("blob")) {
          const response = await fetch(block.backgroundImage);
          const blob = await response.blob();
          const fieldName = `bg_${imageIndex}`;
          const file = new File([blob], `${fieldName}.png`, { type: blob.type });
          formData.append(fieldName, file);
          block.backgroundImage = fieldName;
          imageIndex++;
        }

        if (block.style?.backgroundImage?.startsWith("blob")) {
          const response = await fetch(block.style.backgroundImage);
          const blob = await response.blob();
          const fieldName = `style_bg_${imageIndex}`;
          const file = new File([blob], `${fieldName}.png`, { type: blob.type });
          formData.append(fieldName, file);
          block.style.backgroundImage = fieldName;
          imageIndex++;
        }

        if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
          for (const column of block.columns) {
            for (const child of column) await collectImages(child);
          }
        }

        if (block.type === "customSection" && Array.isArray(block.children)) {
          for (const child of block.children) await collectImages(child);
        }

        if (block.type === "cardRow" && Array.isArray(block.cards)) {
          for (const card of block.cards) {
            if (card.url?.startsWith("blob")) {
              const response = await fetch(card.url);
              const blob = await response.blob();
              const fieldName = `card_row_image_${imageIndex}`;
              const file = new File([blob], `${fieldName}.png`, { type: blob.type });
              formData.append(fieldName, file);
              card.url = fieldName;
              imageIndex++;
            }
          }
        }
      };

      // extract all images
      for (const block of finalBlocks) {
        await collectImages(block);
      }

      // JSON content
      const contentJSON = JSON.stringify({
        subject: previewData.subject,
        blocks: finalBlocks,
      });

      // append form fields
      formData.append("mode_of_communication", mode_of_communication.value);
      formData.append("title", title);

      // ✅ category MUST be array
      formData.append(
        "template_category_id",
        JSON.stringify(Array.isArray(category) ? category : [category])
      );

      formData.append("tags", JSON.stringify(tags));
      formData.append("content", contentJSON);

      // ✅ DEBUG (this confirms payload is correct)
      console.log("FORM DATA:", ...formData.entries());

      await createCommunicationTemplate(formData);

      navigate("/templates/settingList");
    } catch (err) {
      console.error("Save Preview Error:", err);
    }
  };



  const handleUpdatePreview = async () => {
    try {
      const formData = new FormData();

      // ✅ deep clone (DO NOT mutate React state)
      const finalBlocks = JSON.parse(JSON.stringify(previewData.blocks));

      let imageIndex = 1;

      const collectImages = async (block) => {
        if ((block.type === "image" || block.type === "banner" || block.type === "card") && block.url?.startsWith("blob")) {
          const response = await fetch(block.url);
          const blob = await response.blob();
          const fieldName = `image_${imageIndex}`;
          const file = new File([blob], `${fieldName}.png`, { type: blob.type });
          formData.append(fieldName, file);
          block.url = fieldName;
          imageIndex++;
        }

        if (block.type === "customSection" && block.backgroundImage?.startsWith("blob")) {
          const response = await fetch(block.backgroundImage);
          const blob = await response.blob();
          const fieldName = `bg_${imageIndex}`;
          const file = new File([blob], `${fieldName}.png`, { type: blob.type });
          formData.append(fieldName, file);
          block.backgroundImage = fieldName;
          imageIndex++;
        }

        if (block.style?.backgroundImage?.startsWith("blob")) {
          const response = await fetch(block.style.backgroundImage);
          const blob = await response.blob();
          const fieldName = `style_bg_${imageIndex}`;
          const file = new File([blob], `${fieldName}.png`, { type: blob.type });
          formData.append(fieldName, file);
          block.style.backgroundImage = fieldName;
          imageIndex++;
        }

        if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
          for (const column of block.columns) {
            for (const child of column) await collectImages(child);
          }
        }

        if (block.type === "customSection" && Array.isArray(block.children)) {
          for (const child of block.children) await collectImages(child);
        }

        if (block.type === "cardRow" && Array.isArray(block.cards)) {
          for (const card of block.cards) {
            if (card.url?.startsWith("blob")) {
              const response = await fetch(card.url);
              const blob = await response.blob();
              const fieldName = `card_row_image_${imageIndex}`;
              const file = new File([blob], `${fieldName}.png`, { type: blob.type });
              formData.append(fieldName, file);
              card.url = fieldName;
              imageIndex++;
            }
          }
        }
      };

      // extract all images
      for (const block of finalBlocks) {
        await collectImages(block);
      }

      // JSON content
      const contentJSON = JSON.stringify({
        subject: previewData.subject,
        blocks: finalBlocks,
      });

      // append form fields
      formData.append("mode_of_communication", mode_of_communication.value);
      formData.append("title", title);

      // ✅ category MUST be array
      formData.append(
        "template_category_id",
        JSON.stringify(Array.isArray(category) ? category : [category])
      );

      formData.append("tags", JSON.stringify(tags));
      formData.append("content", contentJSON);

      // ✅ DEBUG
      console.log("UPDATE FORM DATA:", [...formData.entries()]);

      await updateCommunicationTemplate(templateId, formData);

      navigate("/templates/settingList");
    } catch (err) {
      console.error("Update Preview Error:", err);
    }
  };


  return (

    <div className="pt-10">
      <div className="flex justify-end ">
        <button
          className="mt-5 bg-blue-600 w-full max-w-fit text-white px-4 py-2 rounded-lg flex justify-end"
          onClick={editMode ? handleUpdatePreview : handleSavePreview}
        >
          {editMode ? "Update Template" : "Save Template"}
        </button>

      </div>
      <div className="bg-white w-full max-w-[600px] m-auto overflow-auto ">

        {/* Header */}

        {/* ✅ Subject (render only once) */}
        {subject && (
          <h1 className="text-2xl font-semibold mb-6">{subject}</h1>
        )}

        {/* Loop blocks */}
        {blocks.map((block, i) => (
          <div
            key={i}
            className="mb-5"
            style={{
              padding: block.style?.padding,
              backgroundColor: block.style?.backgroundColor,
              backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              textAlign: block.style?.textAlign,
              borderRadius: block.style?.borderRadius,
              border: block.style?.borderWidth > 0 ? `${block.style?.borderWidth}px solid ${block.style?.borderColor}` : "none",
              width: block.style?.width,
              maxWidth: block.style?.maxWidth || "100%",
              height: block.style?.height,
              marginTop: block.style?.marginTop || 0,
              marginBottom: block.style?.marginBottom || 20,
              fontFamily: block.style?.fontFamily,
              marginInline: block.style?.textAlign === "center" ? "auto" : block.style?.textAlign === "right" ? "0 0 0 auto" : "0 auto 0 0",
              display: block.style?.display || "block",
              flexDirection: block.style?.flexDirection || "row",
              gap: block.style?.gap ? `${block.style.gap}px` : "0px",
              alignItems: block.style?.alignItems || "stretch",
              justifyContent: block.style?.justifyContent || "start",
              boxShadow: block.style?.boxShadow || "none",
            }}
          >
            {/* CUSTOM SECTION */}
            {block.type === "customSection" && (
              <div
                style={{
                  backgroundImage: block.backgroundImage ? `url(${block.backgroundImage})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col gap-6">
                  {block.children?.map((child) => (
                    <div key={child.id} style={{ textAlign: child.style?.textAlign }}>
                      {child.type === "heading" && (
                        <h2 style={{ fontSize: child.style?.fontSize, color: child.style?.textColor, fontWeight: child.style?.fontWeight }}>
                          {child.content}
                        </h2>
                      )}
                      {child.type === "text" && (
                        <p style={{ fontSize: child.style?.fontSize, color: child.style?.textColor, whiteSpace: "pre-wrap" }}>
                          {child.content}
                        </p>
                      )}
                      {child.type === "logo" && child.url && (
                        <img src={child.url} className="mx-auto max-h-16 object-contain" />
                      )}
                      {child.type === "button" && (
                        <button className="px-6 py-2 rounded-lg font-bold" style={{ backgroundColor: child.style?.backgroundColor || "#237FEA", color: "#fff" }}>
                          {child.content}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CARD BLOCK */}
            {block.type === "card" && (
              <div className="flex flex-col gap-4">
                {block.url && <img src={block.url} className="w-full rounded-lg object-cover" style={{ maxHeight: 300 }} />}
                <div>
                  <h3
                    style={{
                      color: block.style?.textColor,
                      fontSize: `calc(${block.style?.fontSize}px + 4px)`,
                      fontWeight: "bold",
                    }}
                  >
                    {block.title}
                  </h3>
                  <p
                    style={{
                      color: block.style?.textColor,
                      fontSize: block.style?.fontSize,
                      fontWeight: block.style?.fontWeight,
                      opacity: 0.8,
                      marginTop: "4px",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word"
                    }}
                  >
                    {block.description}
                  </p>
                </div>
              </div>
            )}

            {/* HEADING BLOCK */}
            {block.type === "heading" && (
              <h1
                style={{
                  color: block.style?.textColor,
                  fontSize: block.style?.fontSize,
                  fontWeight: block.style?.fontWeight,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word"
                }}
              >
                {block.content}
              </h1>
            )}

            {block.type === "text" && (
              <div
                style={{
                  color: block.style?.textColor,
                  fontSize: block.style?.fontSize,
                  textAlign: block.style?.textAlign,
                  fontFamily: block.style?.fontFamily,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word"
                }}
                className="rich-text-content"
              >
                {parse(block.content || "")}
              </div>
            )}

            {/* BANNER BLOCK */}
            {block.type === "banner" && (
              <img
                src={block.url}
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: 600 }}
              />
            )}

            {/* IMAGE BLOCK */}
            {block.type === "image" && (
              <img
                src={block.url}
                className="w-full max-h-100 rounded-lg object-contain"
              />
            )}

            {/* FEATURE GRID */}
            {block.type === "featureGrid" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {block.items?.map((item, idx) => (
                  <div key={idx} className=" text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SOCIAL LINKS */}
            {block.type === "socialLinks" && (
              <div className="flex gap-4 justify-center">
                {block.links?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm capitalize"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}

            {/* NAVIGATION LINKS */}
            {block.type === "navigation" && (
              <div className="flex gap-6 justify-center">
                {block.links?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="text-gray-600 hover:text-blue-600 font-semibold text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* DIVIDER */}
            {block.type === "divider" && (
              <hr className="border-t-2 border-gray-100 w-full" />
            )}

            {/* ACCORDION */}
            {block.type === "accordion" && (
              <div className="space-y-2">
                {block.items?.map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 p-3 font-semibold text-sm flex justify-between items-center">
                      <span>{item.title}</span>
                      <span className="text-gray-400">▼</span>
                    </div>
                    <div className="p-3 text-sm text-gray-600 bg-white">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BUTTON BLOCK */}
            {block.type === "btn" && (
              <button
                style={{
                  backgroundColor: block.style?.backgroundColor === "transparent" ? "#237FEA" : block.style?.backgroundColor,
                  color: block.style?.textColor,
                  fontSize: block.style?.fontSize,
                  borderRadius: block.style?.borderRadius || 8,
                }}
                className="px-8 py-3 transition-transform hover:scale-105"
              >
                {block.content}
              </button>
            )}

            {/* SECTION GRID */}
            {block.type === "sectionGrid" && (
              <div className={`grid gap-4 grid-cols-${block.columns.length}`}>
                {block.columns.map((col, ci) => (
                  <div key={ci}>
                    {col.map((child) => (
                      <div
                        key={child.id}
                        className="mb-3"
                        style={{ textAlign: child.style?.textAlign }}
                      >
                        {/* TEXT */}
                        {child.type === "text" && (
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
                        )}

                        {/* IMAGE */}
                        {child.type === "image" && (
                          <img
                            src={child.url}
                            className="rounded-lg object-contain w-full"
                          />
                        )}

                        {/* BUTTON */}
                        {child.type === "btn" && (
                          <button
                            style={{
                              backgroundColor: child.style?.backgroundColor || "#237FEA",
                              color: child.style?.textColor || "#ffffff",
                              fontSize: child.style?.fontSize || 14,
                              borderRadius: child.style?.borderRadius || 4,
                            }}
                            className="px-4 py-2"
                          >
                            {child.content}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* CARD ROW */}
            {block.type === "cardRow" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: block.style?.flexDirection || "row",
                  gap: block.style?.gap ? `${block.style.gap}px` : "20px",
                  alignItems: block.style?.alignItems || "stretch",
                  justifyContent: block.style?.justifyContent || "start",
                  flexWrap: "wrap",
                  width: "100%"
                }}
              >
                {(block.cards || []).map((card) => (
                  <div
                    key={card.id}
                    className="flex-1 min-w-[200px]"
                    style={{
                      backgroundColor: card.style?.backgroundColor,
                      borderRadius: card.style?.borderRadius,
                      padding: card.style?.padding,
                      border: "1px solid #eee",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px"
                    }}
                  >
                    {card.url && (
                      <img
                        src={card.url}
                        className="w-full rounded-lg object-cover"
                        style={{ height: "150px" }}
                      />
                    )}
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                      {card.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#666", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}



// const handleSavePreview = async () => {
//   const formData = new FormData();

//   const finalBlocks = structuredClone(previewData.blocks);
//   let imageIndex = 1; // start from 1 → images_1

//   const collectImages = async (block) => {
//     // IMAGE BLOCK
//     if (block.type === "image" && block.url?.startsWith("blob")) {
//       const response = await fetch(block.url);
//       const blob = await response.blob();

//       const fieldName = `images_${imageIndex}`;
//       const file = new File([blob], `${fieldName}.png`, {
//         type: blob.type,
//       });

//       // ✅ Append with unique key
//       formData.append(fieldName, file);

//       // ✅ Replace url with SAME key
//       block.url = fieldName;

//       imageIndex++;
//     }

//     // SECTION GRID (deep images)
//     if (block.type === "sectionGrid" && Array.isArray(block.columns)) {
//       for (const col of block.columns) {
//         for (const child of col) {
//           await collectImages(child);
//         }
//       }
//     }
//   };

//   // Extract all images
//   for (const block of finalBlocks) {
//     await collectImages(block);
//   }

//   // JSON payload
//   const contentJSON = JSON.stringify({
//     subject: previewData.subject,
//     blocks: finalBlocks,
//   });

//   formData.append("mode_of_communication", mode_of_communication.value);
//   formData.append("title", title);
//   formData.append("template_category_id", category);
//   formData.append("tags", JSON.stringify(tags));
//   formData.append("content", contentJSON);

//   await createCommunicationTemplate(formData);
//   navigate("/templates/settingList");
// };

