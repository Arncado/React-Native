import { useState } from "react";
import { FlatList, StyleSheet, Text, View, Button, Modal } from "react-native";
import { Rating, Input, Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import RenderCampsite from "../features/campsites/RenderCampsite";
import { postComment } from "../features/comments/commentsSlice";
import { toggleFavorite } from "../features/favorites/favoritesSlice";

const CampsiteInfoScreen = ({ route }) => {
  const { campsite } = route.params;
  const comments = useSelector((state) => state.comments);
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [rating, setrating] = useState(5);
  const [author, setauthor] = useState();
  const [text, settext] = useState();

  const handleSubmit = () => {
    const newComment = {
      author,
      rating,
      text,
      campsiteId: campsite.id,
    };
    dispatch(postComment(newComment));
    setShowModal(!showModal);
  };

  const resetForm = () => {
    setrating(1);
    setauthor();
    settext();
  };

  const renderCommentItem = ({ item }) => {
    return (
      <View style={styles.commentItem}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
        <Rating
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
          readonly
        />

        <Text style={{ fontSize: 12 }}>
          {`-- ${item.author}, ${item.date}`}
        </Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={comments.commentsArray.filter(
          (comment) => comment.campsiteId === campsite.id
        )}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          marginHorizontal: 20,
          paddingVertical: 20,
        }}
        ListHeaderComponent={
          <>
            <RenderCampsite
              campsite={campsite}
              isFavorite={favorites.includes(campsite.id)}
              markFavorite={() => dispatch(toggleFavorite(campsite.id))}
              onShowModal={() => setShowModal(!showModal)}
            />
            <Text style={styles.commentsTitle}>Comments</Text>
          </>
        }
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.modal}>
          <Rating
            showRating
            startingValue={rating}
            imageSize={40}
            onFinishRating={(rating) => setrating(rating)}
            style={{ paddingVertical: 10 }}
          />

          <Input
            placeholder="Author"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={(author) => setauthor(author)}
            value={author}
          />

          <Input
            placeholder="Comment"
            leftIcon={{ type: "font-awesome", name: "comment-o" }}
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={(text) => settext(text)}
            value={text}
          />

          <View style={{ margin: 10 }}>
            <Button
              onPress={() => {
                handleSubmit();
                resetForm();
              }}
              color="#5637DD"
              title="Submit"
            />
          </View>

          <View style={{ margin: 10 }}>
            <Button
              onPress={() => {
                setShowModal(!showModal);
                resetForm();
              }}
              color="#808080"
              title="Cancel"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  commentsTitle: {
    textAlign: "center",
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    color: "#43484D",
    padding: 10,
    paddingTop: 30,
  },
  commentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default CampsiteInfoScreen;
