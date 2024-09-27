import express from "express";
// import books from "./data.json";
import fs from 'fs';
const app= express();
const port = 8080;
import cors from "cors"


//middleware ---to connect to front end.
app.use(cors());
app.use(express.json());

const getBooksData = () => {
    const data = JSON.parse(fs.readFileSync("data.json"));
    console.log(data);
    return data;
  };

  const saveBooksData = (books) => {
    fs.writeFileSync("data.json", JSON.stringify(books, null, 2), "utf-8");
};

//   getBooksData();

app.get('/',(req,res) => {
    res.send('Hello World!')
})

app.get('/books', (req, res) => {
    const books = getBooksData();
    res.json(books);  
});

app.get('/books/:id',(req,res)=>{
    const books= getBooksData();
    const book = books.find(book => book.id === parseInt(req.params.id));
    if(books){
        res.json(book);
    }else {
        res.status(404).json({message:"Book not found"});
    }
});

app.post('/books',(req,res)=>{
    const books = getBooksData();
    const newBook = req.body;
    newBook.id = books.length +1;
    books.push(newBook);
    saveBooksData(books);
    res.status(201).json(newBook);
});

app.put('/books/:id',(req,res)=> {
    const books = getBooksData();
    const bookIndex = books.findIndex(b=>b.id === parseInt(req.params.id));

    if(bookIndex !== -1){
        const updatedBook = {...books[bookIndex], ...req.body};
        books[bookIndex] = updatedBook;
        saveBooksData(books);
        res.json(updatedBook);
    }else{
        res.status(404).json({message: "Book not found"});
    }
});

app.delete('/books/:id',(req,res)=>{
    const books= getBooksData();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));

    if(bookIndex !== -1){
        const deletedBook = books.splice(bookIndex,1);
        saveBooksData(books);
        res.json(deletedBook);
    }else{
        res.status(404).json({message: "Book not found"});
    }
});


app.listen(port,()=> {
    console.log(`App listening on port ${port}`)
})

