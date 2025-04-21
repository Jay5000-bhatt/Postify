import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Textarea,
} from "flowbite-react";
import { IoMdCreate } from "react-icons/io";
import PostContext  from "../Context/PostContext";
import { useContext } from "react";

const CreatePost = () => {
  const { addPost } = useContext(PostContext);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");

  const onCloseModal = () => {
    setOpenModal(false);
    setTitle("");
    setBody("");
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required.";
    if (!body.trim()) errors.content = "Content is required.";
    return errors;
  };

  const handleCreatePost = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post("/api/posts", { title, content: body });
      addPost(res.data);
      onCloseModal();
    } catch (err) {
      setError("Failed to create post.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="fixed bottom-6 right-6 z-50">
        <IoMdCreate
          onClick={() => setOpenModal(true)}
          className="text-sky-800 text-5xl sm:text-6xl p-3 sm:p-4 bg-white border-4 border-sky-600 shadow-lg rounded-full cursor-pointer hover:scale-105 transition-transform"
        />
      </div>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-10 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white text-center">
              Create a New Post
            </h3>

            <div>
              <Label htmlFor="title" className="mb-2 block">
                Title
              </Label>
              <TextInput
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                color={formErrors.title ? "failure" : undefined}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content" className="mb-2 block">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className={`w-full ${
                  formErrors.content ? "border-red-500" : ""
                }`}
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.content}
                </p>
              )}
            </div>

            <div className="w-full">
              <Button onClick={handleCreatePost} className="w-full">
                Create Post
              </Button>
            </div>
            {error && (
              <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CreatePost;
