export const SiblingFinder = () => {
    const element = document.getElementById(".dropDetectionBox");
    console.log(element)

    if (element) {
        // Get the parent element
        const parentElement = element.parentNode;

        if (parentElement) {
            // Get the next sibling
            const nextSibling = parentElement.nextSibling;

            // Get the previous sibling
            const previousSibling = parentElement.previousSibling;

            // Check if siblings exist
            if (nextSibling) {
                console.log("Next Sibling:", nextSibling);
            } else {
                console.log("No Next Sibling");
            }

            if (previousSibling) {
                console.log("Previous Sibling:", previousSibling);
            } else {
                console.log("No Previous Sibling");
            }
        }
    }
}