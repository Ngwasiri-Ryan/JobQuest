import React, { useState } from "react";
import {
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { fetchResumeData } from "../../backend/resume/fetchData";
import { COLORS, icons } from "../../constants";
import RNFS from "react-native-fs";
import Share from "react-native-share";

const { width, height } = Dimensions.get("window");

const GenerateResumeButton = ({ username }) => {
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState(""); // Initialize as an empty string

  const generateResumeHTML = (resumeData) => {
    const {
      personalDetails,
      education = [],
      workExperience = [],
      skills = [],
      projects = [],
      languages = [],
    } = resumeData;

    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
            }
            h1, h2, h3 {
              color: #333;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              border-bottom: 2px solid #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .content-item {
              margin-bottom: 10px;
            }
            .content-item h3 {
              margin: 0;
              font-size: 18px;
            }
            .content-item p {
              margin: 5px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>Resume</h1>
          <div class="section">
            <div class="section-title">Personal Details</div>
            <p><strong>Name:</strong> ${personalDetails?.name || "Name not provided"}</p>
            <p><strong>Email:</strong> ${personalDetails?.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${personalDetails?.phone || "N/A"}</p>
            <p><strong>Address:</strong> ${personalDetails?.address || "N/A"}</p>
          </div>
          <div class="section">
            <div class="section-title">Education</div>
            ${education
              .map(
                (edu) => `
              <div class="content-item">
                <h3>${edu.degree || "N/A"} - ${edu.institution || "N/A"}</h3>
                <p>${edu.startDate || "N/A"} - ${edu.endDate || "N/A"}</p>
                <p>${edu.description || ""}</p>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="section">
            <div class="section-title">Work Experience</div>
            ${workExperience
              .map(
                (work) => `
              <div class="content-item">
                <h3>${work.position || "N/A"} at ${work.company || "N/A"}</h3>
                <p>${work.startDate || "N/A"} - ${work.endDate || "N/A"}</p>
                <p>${work.description || ""}</p>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="section">
            <div class="section-title">Skills</div>
            <ul>
              ${skills.map((skill) => `<li>${skill}</li>`).join("")}
            </ul>
          </div>
          <div class="section">
            <div class="section-title">Projects</div>
            ${projects
              .map(
                (project) => `
              <div class="content-item">
                <h3>${project.title || "N/A"}</h3>
                <p>${project.description || ""}</p>
                <p><strong>Technologies:</strong> ${project.technologies || "N/A"}</p>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="section">
            <div class="section-title">Languages</div>
            <ul>
              ${languages.map((language) => `<li>${language}</li>`).join("")}
            </ul>
          </div>
        </body>
      </html>
    `;
  };

  const handleGenerateResume = async () => {
    setLoading(true);
    try {
      const resumeData = await fetchResumeData(username);
      if (!resumeData) throw new Error("No resume data found.");

      const htmlContent = generateResumeHTML(resumeData);

      const options = {
        html: htmlContent,
        fileName: `Resume_${username}`,
        directory: "Documents",
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      if (pdf.filePath) {
        setPdfPath(pdf.filePath);
        Alert.alert("Success", `Resume saved to ${pdf.filePath}`);
      } else {
        throw new Error("PDF generation failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareResume = async () => {
    try {
      if (!pdfPath) {
        Alert.alert("Error", "Generate the resume first before sharing.");
        return;
      }

      const fileExists = await RNFS.exists(pdfPath);
      if (!fileExists) {
        Alert.alert("Error", "PDF file not found");
        return;
      }

      const options = {
        title: "Share PDF",
        url: `file://${pdfPath}`,
        type: "application/pdf",
        message: "Here’s my resume in PDF format.",
      };

      await Share.open(options);
    } catch (error) {
      Alert.alert("Error", "Failed to share the PDF");
      console.error("Share error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={handleGenerateResume}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <Image source={icons.download} style={styles.icon} />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton} onPress={handleShareResume}>
        <Image source={icons.sharing} style={styles.shareIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.05,
  },
  button: {
    height: height * 0.07,
    width: height * 0.07,
    borderRadius: height * 0.035,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  disabled: {
    backgroundColor: "#333",
  },
  icon: {
    height: width * 0.06,
    width: width * 0.06,
    resizeMode: "contain",
    tintColor: "#FC635B",
  },
  shareIcon: {
    height: width * 0.06,
    width: width * 0.06,
    resizeMode: "contain",
    tintColor: "#018154",
  },
});

export default GenerateResumeButton;
