AOS.init();
const toggleBtn = document.getElementById('toggle-btn');
const body = document.body;

// chatbot 
function sendMessage(message) {
    var userInput = message || document.getElementById("user-input").value.trim();
    var chatbotBody = document.getElementById("chatbot-body");
    var suggestions = document.getElementById("suggestions");
  
    if (!userInput) return;
  
    var userMessage = "<div class='me'>" + userInput + "</div>";
    var csrftoken = getCookie('csrftoken');
  
    chatbotBody.innerHTML += userMessage;
  
    document.getElementById("user-input").value = "";
    suggestions.style.display = "none";
  
    $.ajax({
      url: "/chatbot/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ user_query: userInput }),
      headers: { "X-CSRFToken": csrftoken },
      success: function(response) {
        console.log("response: ", response);
  
        chatbotBody.innerHTML += "<div class='you'>" + response.message + "</div>";
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      },
      error: function(xhr, status, error) {
        console.error("Error:", error);
      }
    });
  }
  
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }


  function openModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = src;
  }
  
  function closeModal() {
    document.getElementById("imageModal").style.display = "none";
  }
  

  let currentImageIndex = 0;
  
  function openGalleryModal(index) {
    event.stopPropagation();
    currentImageIndex = index;
    document.getElementById("galleryModal").style.display = "block";
    document.getElementById("galleryModalImg").src = galleryImages[index];
  }
  
  function closeGalleryModal() {
    document.getElementById("galleryModal").style.display = "none";
  }
  
  function nextImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    document.getElementById("galleryModalImg").src = galleryImages[currentImageIndex];
  }
  
  function prevImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById("galleryModalImg").src = galleryImages[currentImageIndex];
  }
  
  
  //quiz

  let triviaList = [];  // Array to store fetched trivia questions
let currentQuestionIndex = 0;  // Index to keep track of current question
let correctCount = 0; // Counter for correct answers
let incorrectCount = 0; // Counter for incorrect answers

document.addEventListener('DOMContentLoaded', async function() {
  await fetchTriviaQuestions();  // Fetch questions when DOM content is loaded
  showQuestion();  // Display the first question
});

async function fetchTriviaQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=20&type=boolean');  // Fetching 20 true/false questions
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      triviaList = data.results;  // Store fetched questions in the array
      console.log("Fetched trivia questions:", triviaList);
    } else {
      console.error('No trivia questions found.');
    }
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
  }
}

function showQuestion() {
  if (currentQuestionIndex < triviaList.length) {
    const trivia = triviaList[currentQuestionIndex];

    const quizBody = document.getElementById("quiz-body");
    quizBody.innerHTML = `
      <div class="question">
        <p>${trivia.question}</p>
      </div>
    `;
  } else {
    fetchTriviaQuestions();
    currentQuestionIndex = 0;
  }
}

function validate(userInput) {
  const trivia = triviaList[currentQuestionIndex];
  const correctAnswer = trivia.correct_answer.toLowerCase() === "true"; // Convert correct answer to boolean

  const quizBody = document.getElementById("quiz-body");
  const answerFeedback = userInput === correctAnswer;

  const answerHtml = `
    <div class="answer">
      <span style="color: ${answerFeedback ? 'green' : 'red'};">${answerFeedback ? 'Correct!' : 'Incorrect!'}</span>
    </div>
  `;

  quizBody.innerHTML += answerHtml;  // Append the answer feedback to the quiz body

  // Update correct and incorrect counters
  if (answerFeedback) {
    correctCount++;
  } else {
    incorrectCount++;
  }

  // Update counters in the header
  document.getElementById('correctCount').textContent = `Correct: ${correctCount}`;
  document.getElementById('incorrectCount').textContent = `Incorrect: ${incorrectCount}`;

  currentQuestionIndex++;  // Move to the next question
  setTimeout(showQuestion, 2000);  // Display the next question after 2 seconds
}