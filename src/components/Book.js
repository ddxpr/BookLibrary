import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Table, Button, Modal } from 'react-bootstrap';

const initialBookState = {
  title: '',
  publisher: '',
  author_first_name: '',
  author_last_name: '',
  type: '',
  isbn: '',
  category: '',
  total_copies: 0,
  copies_in_use: 0,
  status: '',
};

function Book() {
  const [searchParams, setSearchParams] = useState({ author: '', isbn: '', status: '' });
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(initialBookState);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getAllBooks(); 
  }, []);

  async function searchBooks() {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:5238/Book/Search?${query}`);
      setBooks(response.data);
    } catch (error) {
      console.error('There was an error fetching the books:', error);
    }
  }

  async function getAllBooks() {
    try {
      const response = await axios.get('http://localhost:5238/Book/GetBook');
      setBooks(response.data);
    } catch (error) {
      console.error('There was an error fetching all books:', error);
    }
  }

  async function addBook(bookDetails) {
    try {
      await axios.post('http://localhost:5238/Book/AddBook', bookDetails);
      getAllBooks();
    } catch (error) {
      console.error('There was an error adding the book:', error);
    }
  }

  async function updateBook(bookDetails) {
    try {
      await axios.patch(`http://localhost:5238/Book/UpdateBook/${bookDetails.book_id}`, bookDetails);
      getAllBooks();
    } catch (error) {
      console.error('There was an error updating the book:', error);
    }
  }

  async function deleteBook(bookId) {
    try {
      await axios.delete(`http://localhost:5238/Book/DeleteBook/${bookId}`);
      getAllBooks();
    } catch (error) {
      console.error('There was an error deleting the book:', error);
    }
  }

  function openModalForEdit(book) {
    setIsEditing(true);
    setCurrentBook({ ...initialBookState, ...book });
    setShowModal(true);
  }

  function openModalForAdd() {
    setIsEditing(false);
    setCurrentBook(initialBookState); 
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleSaveBook() {
    if (isEditing) {
      updateBook(currentBook);
    } else {
      addBook(currentBook);
    }
    setShowModal(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCurrentBook((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1 className="text-center mt-4">Book Library</h1>
          <Form className="mt-4">
            <Row>
              <Col md={5}>
                <Form.Group controlId="formAuthor">
                  <Form.Control
                    type="text"
                    placeholder="Search by author"
                    value={searchParams.author}
                    onChange={(e) => setSearchParams({ ...searchParams, author: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="formISBN">
                  <Form.Control
                    type="text"
                    placeholder="Search by ISBN"
                    value={searchParams.isbn}
                    onChange={(e) => setSearchParams({ ...searchParams, isbn: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button variant="primary" onClick={searchBooks}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end mb-2">
          <Button variant="primary" onClick={openModalForAdd}>Add New Book</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive="md">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Publisher</th>
                <th>Authors</th>
                <th>Type</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Available Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.book_id}>
                  <td>{book.title}</td>
                  <td>{book.publisher}</td>
                  <td>{`${book.first_name} ${book.last_name}`}</td>
                  <td>{book.type}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.total_copies - book.copies_in_use}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => openModalForEdit(book)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteBook(book.book_id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Book' : 'Add Book'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <Form>
    <Form.Group controlId="formBookTitle">
      <Form.Label>Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter book title"
        name="title"
        value={currentBook.title}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formBookPublisher">
      <Form.Label>Publisher</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter publisher"
        name="publisher"
        value={currentBook.publisher}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formAuthorFirstName">
      <Form.Label>Author First Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter author's first name"
        name="author_first_name"
        value={currentBook.first_name}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formAuthorLastName">
      <Form.Label>Author Last Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter author's last name"
        name="author_last_name"
        value={currentBook.last_name}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formBookType">
      <Form.Label>Type</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter book type"
        name="type"
        value={currentBook.type}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formBookISBN">
      <Form.Label>ISBN</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter ISBN number"
        name="isbn"
        value={currentBook.isbn}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formBookCategory">
      <Form.Label>Category</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter book category"
        name="category"
        value={currentBook.category}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formTotalCopies">
      <Form.Label>Total Copies</Form.Label>
      <Form.Control
        type="number"
        placeholder="Enter total copies"
        name="total_copies"
        value={currentBook.total_copies}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formCopiesInUse">
      <Form.Label>Copies in Use</Form.Label>
      <Form.Control
        type="number"
        placeholder="Enter copies currently in use"
        name="copies_in_use"
        value={currentBook.copies_in_use}
        onChange={handleChange} />
    </Form.Group>

    <Form.Group controlId="formBookStatus">
      <Form.Label>Status</Form.Label>
      <Form.Control
        as="select"
        name="status"
        value={currentBook.status}
        onChange={handleChange}>
        <option value="">Select a status</option>
        <option value="own">Own</option>
        <option value="love">Love</option>
        <option value="want to read">Want to Read</option>
      </Form.Control>
    </Form.Group>
  </Form>
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveBook}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Book;
