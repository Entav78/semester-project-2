import { API_LISTINGS } from "../../js/api/constants.js";
import { Listing } from "../../models/listing.js";
import { Bidding } from "../../js/api/Bidding.js";

export function initializeItemPage() {
  console.log("Initializing Item Page...");

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");
  console.log("Extracted Item ID:", itemId);

  if (!itemId) {
    console.error("No item ID found in URL");
    document.getElementById("item-container").innerHTML = "<p class='text-red-500'>Item not found.</p>";
    return;
  }

  console.log(`Fetching item with ID: ${itemId}`);

  fetch(`${API_LISTINGS}/${itemId}?_seller=true&_bids=true`) // Fetch seller and bids
  .then(response => {
    if (!response.ok) throw new Error(`Failed to fetch item: ${response.statusText}`);
    return response.json();
  })
  .then(responseData => {
    const data = responseData.data; // Extract correct data object
    console.log(" Corrected Item Data:", data);


    //  Extract correct item data
    const itemData = data.data || data; 
    console.log("🔍 Corrected Item Data:", itemData);
    console.log("🔍 Media Data:", itemData.media);
    console.log("🔍 First Image URL:", itemData.media?.[0]?.url);


    const item = new Listing(data);
    const itemContainer = document.getElementById("item-container");
    console.log("🔍 Checking item-container:", document.getElementById("item-container"));

    if (!itemContainer) {
      console.error("item-container NOT found in the DOM!");
      return;
    }

    // Create elements instead of using innerHTML (for security)
    const title = document.createElement("h1");
    title.classList.add("text-3xl", "font-bold", "text-text", "text-center", "mb-4");
    title.textContent = item.title || "Untitled";

    // Image Handling Fix
    const image = document.createElement("img");
    console.log("Full Item Data:", data);
    console.log("Media Data:", data.media);
    console.log("First Image URL:", data.media?.[0]?.url);

    image.src = itemData.media?.[0]?.url || "/assets/Sasha.jpg";  
 //  Correct line

    image.alt = item.title || "No image available";
    image.classList.add("w-full", "max-w-lg", "rounded-lg", "shadow-lg", "mx-auto", "border", "border-primary");

    const description = document.createElement("p");
    description.classList.add("text-text", "text-center", "mt-4", "leading-relaxed", "p-4", "rounded-lg", "shadow-md");
    description.textContent = item.description || "No description available.";

    

  // ✅ Retrieve User Data Safely
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.userName || null; // Ensure we're using userName

  if (!userName) {
    console.warn("⚠️ No userName found in localStorage. Redirecting to login.");
    window.location.href = "/login"; // Redirect if no user
  }
  // ✅ Find the Highest Bid (If Any)
  const highestBid = data.bids?.length ? Math.max(...data.bids.map(bid => bid.amount)) : "No bids yet";

  const currentBidElement = document.createElement("p");
  currentBidElement.classList.add(
    "font-semibold",
    "text-center",
    "mt-6",  // ✅ Top margin
    "mb-4",  // ✅ Bottom margin to create space before auctionEnd
    "p-4",
    //"bg-soft",
    "rounded-lg",
    "shadow-inner",
    "text-text"
  );
  currentBidElement.textContent = `Current Highest Bid: ${highestBid} credits`;



  // ✅ Auction Status (Ended or Active)
  const auctionEnd = document.createElement("p");
  auctionEnd.classList.add(
    "text-text",
    "font-bold",
    //"bg-soft",
    "p-3",
    "rounded-lg",
    "shadow-md",
    "text-center", 
    "uppercase",
    "tracking-wide"
  );

  // Check if auction has ended
  if (data.endsAt) {
    const now = new Date();
    const auctionEndTime = new Date(data.endsAt);

    if (auctionEndTime < now) {
      auctionEnd.textContent = "SOLD / AUCTION ENDED";
      auctionEnd.classList.add(
        "text-white", "bg-coffee",
      );
    } else {
      auctionEnd.textContent = `Auction Ends: ${auctionEndTime.toLocaleString()}`;
      auctionEnd.classList.add("text-text");
    }
  } else {
    auctionEnd.textContent = "No deadline set";
    auctionEnd.classList.add("text-gray-500");
  }

  console.log("🔍 User Data:", user);
  console.log("🔍 UserName from localStorage:", user.userName);
  console.log("🔍 All Bids:", data.bids);
  console.log("🛠 Bid Structure:", data.bids);


  // ✅ Find the User's Highest Bid (if any)
  const userBids = data.bids?.filter(bid => bid.bidder?.name === user.userName) || [];
  const userHighestBid = userBids.length ? Math.max(...userBids.map(bid => bid.amount)) : null;


  // ✅ Create "Your Current Bid" Element
  if (userHighestBid !== null) {
    const userBidElement = document.createElement("p");
    userBidElement.classList.add(
      "font-semibold", 
      "text-center", 
      "mt-4", 
      "p-4", 
      "bg-soft", 
      "rounded-lg", 
      "shadow-inner", 
      "text-text"
    );
    userBidElement.textContent = `Your Current Bid: ${userHighestBid} credits`;

    // ✅ Now we can append everything in the correct order
  itemContainer.append(title, image, description, currentBidElement, userBidElement, auctionEnd);
} else {
  itemContainer.append(title, image, description, currentBidElement, auctionEnd);
}

  // ✅ Clear old content FIRST
  itemContainer.innerHTML = ""; 

  // ✅ Append elements in the correct order
  itemContainer.append(title, image, description, currentBidElement, auctionEnd);



  //  Ensure only one bid input field exists
  let bidInput = document.getElementById("bid-input");

  if (!bidInput) {
    bidInput = document.createElement("input");
    bidInput.type = "number";
    bidInput.placeholder = "Enter your bid";
    bidInput.id = "bid-input"; //  Unique ID
    bidInput.classList.add(
      "bg-soft",           // Light background
      "border", "border-text",  // Subtle border color
      "text-text",         // Matching text color
      "p-3",              // Padding for better spacing
      "rounded-lg",       // Soft, rounded corners
      "w-full",           // Makes it responsive
      "focus:outline-none", "focus:ring-2", "focus:ring-accent", // Focus effect
      "transition",        // Smooth transition effect
      "mt-6"
    );
    
    itemContainer.append(bidInput); // Append only if it's missing
  }

  //  Check if a bid button already exists in the item container
  let bidButton = document.getElementById("place-bid-btn");

  if (!bidButton) {
    bidButton = document.createElement("button");
    bidButton.textContent = "Place Bid";
    bidButton.classList.add(
      "bg-primary",        // Button background color
      "text-white",        // White text for contrast
      "px-4", "py-2",      // Padding for better clickability
      "rounded-lg",        // Rounded corners
      "font-semibold",     // Bold font
      "shadow-md",         // Adds a slight depth effect
      "hover:bg-accent",   // Darker brown on hover
      "transition",
      "mt-6",
      "active:scale-95",
      "w-full",        // ✅ Makes button take full width
    "max-w-xs",      // ✅ Limits the width for a clean look
    "mx-auto",       // ✅ Centers it horizontally
    "block",         // ✅ Ensures it behaves like a block element
    "text-center"        
    );
    
    bidButton.id = "place-bid-btn"; // Add ID to prevent duplicates
    itemContainer.append(bidButton); //  Add the button only if it's missing
  }

  console.log("Listing ends at:", data.endsAt);

  // Initialize Bidding system with the input field
  new Bidding(itemId, bidButton, bidInput);


    })
    .catch(error => {
      console.error("Error loading item:", error);
      document.getElementById("item-container").innerHTML = `<p class="text-red-500">Error loading item details.</p>`;
    });
}










