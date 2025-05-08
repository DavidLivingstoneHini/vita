import { Dimensions, Platform } from "react-native";

// Get screen width and height
const { width, height } = Dimensions.get("window");

// Set base font size (you can adjust this based on your design)
const guidelineBaseWidth = 375; // iPhone 8 standard screen width
const guidelineBaseHeight = 667; // iPhone 8 standard screen height

// Scaling function to make the design responsive
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Responsive font size (use this to make the font responsive)
const responsiveFontSize = size => moderateScale(size);

// Screen size in percentage (responsive to the screen size)
const vw = width / 100;
const vh = height / 100;

// Export the utility functions
export { responsiveFontSize, vh, vw };