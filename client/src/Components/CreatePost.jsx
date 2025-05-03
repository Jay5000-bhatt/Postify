import React, { useState, useContext } from "react";
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
import PostContext from "../Context/PostContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreatePost = () => {
  const { fetchPosts } = useContext(PostContext);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onCloseModal = () => {
    setOpenModal(false);
    setError("");
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required."),
      content: Yup.string().trim().required("Content is required."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
       await axios.post("/api/posts/createpost", {
          title: values.title,
          content: values.content,
        });
        await fetchPosts();
        formik.resetForm();
        onCloseModal();
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || "Failed to create post.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

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
            <h3 className="text-2xl sm:text-3xl font-semibold text-black text-center">
              Create a New Post
            </h3>

            {/* Title Input */}
            <div>
              <Label htmlFor="title" className="mb-2 block">
                Title
              </Label>
              <TextInput
                id="title"
                placeholder="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                color={
                  formik.touched.title && formik.errors.title
                    ? "failure"
                    : undefined
                }
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.title}
                </p>
              )}
            </div>

            {/* Content Input */}
            <div>
              <Label htmlFor="content" className="mb-2 block">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full ${
                  formik.touched.content && formik.errors.content
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.content && formik.errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.content}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full">
              <Button
                type="submit"
                onClick={formik.handleSubmit}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Post"} {/* Loading text */}
              </Button>
            </div>

            {/* Display server-side errors */}
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
