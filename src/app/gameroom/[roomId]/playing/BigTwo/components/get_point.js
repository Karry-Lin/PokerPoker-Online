// Function to count points based on the cards
export default function get_point(card) {
    let n = card.length; // Get the number of cards (length of array)
    
    // Check if any special card is included in the array
    // Special cards are: 2, 15, 28, 41
    const specialCards = [2, 15, 28, 41];
    for (let specialCard of specialCards) {
        if (card.includes(specialCard)) {
            n *= 2; // Double the value of n if a special card is found
        }
    }

    return -n*10; // Return the final value of n
}