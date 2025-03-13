import { collection, query, where, getDocs } from "firebase/firestore";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { db } from "../Firebase";

// Fetch user event data grouped by date
export const fetchUserEventData = async (username) => {
  try {
    const eventsRef = collection(db, "userEvents");
    const q = query(eventsRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No events found for this username.");
      return { success: false, error: "No events found" };
    }

    const eventCountByDate = {};
    let earliestDate = null;
    let latestDate = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Raw Data:', data); // Log the raw data for inspection

      // Convert Firebase Timestamp to JavaScript Date
      const timestamp = new Date((data.timestamp.seconds * 1000) + (data.timestamp.nanoseconds / 1000000));
      console.log('Parsed Timestamp:', timestamp); // Log the parsed timestamp

      // Handle cases where timestamp is invalid
      if (isNaN(timestamp)) {
        console.log('Invalid timestamp:', data.timestamp);
        return;
      }

      // Track the earliest and latest dates
      if (!earliestDate || timestamp < earliestDate) {
        earliestDate = timestamp;
      }
      if (!latestDate || timestamp > latestDate) {
        latestDate = timestamp;
      }

      // Format the date (e.g., "2024-12-24") and count occurrences
      const formattedDate = format(timestamp, "yyyy-MM-dd");
      if (!eventCountByDate[formattedDate]) {
        eventCountByDate[formattedDate] = 0;
      }
      eventCountByDate[formattedDate] += 1;
    });

    if (!earliestDate || !latestDate) {
      console.log("No valid dates found in the data.");
      return { success: false, error: "No valid dates" };
    }

    // Generate all dates between the earliest and latest date
    const allDates = eachDayOfInterval({ start: earliestDate, end: latestDate });

    // Prepare the formatted data for the graph
    const formattedData = allDates.map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return {
        label: format(date, "MMM-dd-yyyy").toUpperCase(), // Format as DEC-01-2024
        value: eventCountByDate[formattedDate] || 0, // Use 0 if no events for this date
      };
    });
    
    // Ensure the graph starts at the origin
    formattedData.unshift({
      label: "ORIGIN", // Optional: label for the origin point
      value: 0, // Start at 0
    });

    // Log the transformed formatted data before returning
    console.log("Formatted Graph Data:", formattedData);

    return { success: true, data: formattedData };

  } catch (error) {
    console.error("Error fetching user event data:", error);
    return { success: false, error: error.message };
  }
};
