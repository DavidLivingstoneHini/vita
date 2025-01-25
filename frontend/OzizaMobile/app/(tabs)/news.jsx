import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native"

// Dummy data for "For You" section
const forYouData = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  image: `https://picsum.photos/200/300?random=${i}`,
  descriptionTitle: `Image ${i} Description Title`, 
  text: `Image ${i} Description`,
}));

// Dummy data for "Editor's Pick"
const editorsPick = {
  image: 'https://picsum.photos/200/300?random=100',
  descriptionTitle: 'Why We Love It', 
  text: 'This image is our editor\'s favorite pick of the week. It showcases a beautiful scenery that will leave you breathless.',
};

// Dummy data for buttons (limited to 21 to fit within 3 rows of 7)
const buttonsData = Array.from({ length: 21 }, (_, i) => ({
  id: i,
  text: i === 0? 'For You' : `Button ${i}`,
}));

const News = () => {
  const [selectedButton, setSelectedButton] = useState(buttonsData[0]);

  const renderContent = () => {
    if (selectedButton.id === 0) {
      return <ForYouContent selectedButton={selectedButton} />;
    } else {
      return (
        <View>
          <Text>Content for Button {selectedButton.id}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>News</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.multiRowScrollView}
        >
          <View style={styles.buttonRowsContainer}>
            {Array.from({ length: 3 }, (_, rowIndex) => ( // 3 rows
              <View key={rowIndex} style={styles.buttonRow}>
                {buttonsData.slice(rowIndex * 7, (rowIndex + 1) * 7).map((button) => ( // 7 buttons per row
                  <TouchableOpacity
                    key={button.id}
                    style={[
                      styles.smallButton,
                      selectedButton.id === button.id && styles.selectedSmallButton,
                    ]}
                    onPress={() => setSelectedButton(button)}
                  >
                    <Text style={[styles.smallButtonText, selectedButton.id === button.id && { color: '#fff' }]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

const ForYouContent = ({ selectedButton }) => {
  return (
    <ScrollView style={forYouStyles.forYouContainer}>
      {/* Editor's Pick Section */}
      <View style={forYouStyles.editorsPickContainer}>
        <Text style={forYouStyles.editorsPickTitle}>Editor's Pick</Text>
        <Image
          source={{ uri: editorsPick.image }}
          style={forYouStyles.editorsPickImage}
          resizeMode="cover"
        />
        <Text style={forYouStyles.descriptionTitle}>{editorsPick.descriptionTitle}</Text>
        <Text style={forYouStyles.forYouText}>{editorsPick.text}</Text>
      </View>

      {/* Vertical List of Images */}
      <View style={forYouStyles.listTitleContainer}>
        <Text style={forYouStyles.listTitle}>{selectedButton.text}</Text>
        <TouchableOpacity onPress={() => console.log('See All pressed')}><Text style={forYouStyles.seeAll}>See All</Text></TouchableOpacity>
      </View>
      {forYouData.map((item) => (
        <TouchableOpacity key={item.id} style={forYouStyles.forYouItem} onPress={() => console.log(`Image ${item.id} pressed`)}>
          <Image
            source={{ uri: item.image }}
            style={forYouStyles.forYouImage}
            resizeMode="cover"
          />
          <Text style={forYouStyles.descriptionTitle}>{item.descriptionTitle}</Text>
          <Text style={forYouStyles.forYouText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 160,
  },
  buttonRowsContainer: {
    flexDirection: 'column',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  multiRowScrollView: {
    width: '100%',
  },
  smallButton: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#828282',
  },
  selectedSmallButton: {
    backgroundColor: '#1C3612',
  },
  smallButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

const forYouStyles = StyleSheet.create({
  forYouContainer: {
    flex: 1,
  },
  editorsPickContainer: {
    marginBottom: 24, // Spacing between Editor's Pick and the list
  },
  editorsPickTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  editorsPickImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  forYouItem: {
    marginBottom: 16,
  },
  forYouImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: -2,
    color: '#000000',
  },
  forYouText: {
    fontSize: 14,
    marginTop: 8,
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 500,
  },
});

export default News;
