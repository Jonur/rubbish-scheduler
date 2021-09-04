const getNextWasteCollectionDetails = (wasteDetails = "") => {
  const formattedSanitisedWasteDetails =
    wasteDetails
      .trim()
      .split("\n")
      .map((detail) => detail.split("\t")) || [];

  return (
    (formattedSanitisedWasteDetails.find(
      ([detailTitle]) => detailTitle === "Next collection"
    ) || [])[1] || ""
  );
};

module.exports = getNextWasteCollectionDetails;
