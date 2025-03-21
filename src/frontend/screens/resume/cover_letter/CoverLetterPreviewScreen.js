import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Pdf from 'react-native-pdf';
import {COLORS, icons} from '../../../constants';

const CoverLetterPreviewScreen = ({route, navigation}) => {
  const {coverLetterData} = route.params;
  const [pdfPath, setPdfPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const fileName = `cover_letter_${currentDate}.pdf`; // File name with date
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`; // Save in the download folder

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Calibri', 'Arial', 'Times New Roman', sans-serif;
              font-size: 12pt;
              line-height: 1.5;
              margin: 1in;
              padding: 0;
            }
            .sender-details, .closing-and-signature {
              text-align: right;
              margin-bottom: 24pt;
            }
            .receiver-details {
              text-align: left;
              margin-bottom: 24pt;
            }
            .section-spacing {
              margin-bottom: 12pt;
            }
            p {
              margin: 0 0 12pt 0;
            }
            .clear {
              clear: both;
            }
          </style>
        </head>
        <body>
          <!-- Sender Details (Top-Right) -->
          <div class="sender-details">
            <p>${coverLetterData.senderName}</p>
            <p>${coverLetterData.senderAddress}</p>
            <p>${coverLetterData.senderPhone}</p>
            <p>${coverLetterData.senderEmail}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>

          <!-- Receiver Details (Top-Left) -->
          <div class="receiver-details">
            <p>${coverLetterData.receiverName}</p>
            <p>${coverLetterData.receiverCompany}</p>
            <p>${coverLetterData.receiverAddress}</p>
          </div>

          <!-- Clear floats -->
          <div class="clear"></div>

          <!-- Salutation -->
          <p>Dear ${coverLetterData.receiverName || 'Hiring Manager'},</p>
          <div class="section-spacing"></div>

          <!-- Opening Paragraph -->
          <p>${coverLetterData.openingParagraph}</p>
          <div class="section-spacing"></div>

          <!-- Body Paragraph -->
          <p>${coverLetterData.bodyParagraph}</p>
          <div class="section-spacing"></div>

          <!-- Closing Paragraph -->
          <p>I look forward to the possibility of discussing this opportunity further. Please feel free to contact me at your convenience.</p>
          <div class="section-spacing"></div>

          <!-- Closing & Signature -->
          <div class="closing-and-signature">
            <p>Best regards,</p>
            <p>${coverLetterData.senderName}</p>
          </div>
        </body>
      </html>
    `;

    const options = {
      html: htmlContent,
      fileName: fileName, // Use the dynamically generated file name
      directory: 'Downloads', // Save in the download folder
    };

    const file = await RNHTMLtoPDF.convert(options);
    return file.filePath;
  };

  const handleGenerateAndViewPDF = async () => {
    setLoading(true);
    try {
      const filePath = await generatePDF();
      setPdfPath(filePath);

      // Show success alert
      Alert.alert(
        'Success',
        `Cover Letter saved in Downloads folder:\n${filePath}`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    } catch (error) {
      console.error('Error generating PDF:', error);

      // Show error alert
      Alert.alert('Error', 'Failed to generate PDF. Please try again.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndShare = async () => {
    if (!pdfPath) {
      alert('Please generate the PDF first.');
      return;
    }
    await Share.open({url: `file://${pdfPath}`});
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={icons.back} style={[styles.backIcon]} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Preview Your Cover Letter</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {pdfPath ? (
          <Pdf
            source={{uri: `file://${pdfPath}`}}
            style={styles.pdfViewer}
            onLoadComplete={numberOfPages => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onError={error => {
              console.error('Error loading PDF:', error);
            }}
          />
        ) : (
          <Text style={styles.noPdfText}>No PDF generated yet.</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.generate}
            onPress={handleGenerateAndViewPDF}>
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Generate PDF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.share} onPress={handleSaveAndShare}>
            <Text style={styles.buttonText}>Save & Share PDF</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#4CAF50" />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    backgroundColor: COLORS.black,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  pdfViewer: {
    width: '100%',
    height: 700,
    marginBottom: 20,
  },
  noPdfText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  generate: {
    padding: 15,
    backgroundColor: COLORS.red,
    borderRadius: 10,
  },
  share: {
    padding: 15,
    backgroundColor: COLORS.green,
    borderRadius: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  backButton: {
    left: '-15%',
    right: 0,
  },
});

export default CoverLetterPreviewScreen;