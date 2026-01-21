const getTextContent = (elements: Element[]) => elements.map((e) => (e.textContent || "").trim());

export default getTextContent;
