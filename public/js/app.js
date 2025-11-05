// Global state
let answers = {};
let selectedTraits = [];
let allQuestionsData = {};

// Constants
const MINUTES_PER_QUESTION = 1.5;

// Initialize UI
function renderTraitSelection() {
  const checkboxDiv = document.getElementById("traitCheckboxes");
  checkboxDiv.innerHTML = "";
  
  Object.keys(traits).forEach(trait => {
    const traitInfo = traitInterpretations[trait];
    const questionCount = traits[trait].length;
    const estimatedTime = Math.ceil(questionCount * MINUTES_PER_QUESTION);
    
    const card = document.createElement("div");
    card.className = "trait-card";
    if (selectedTraits.length === 0 || selectedTraits.includes(trait)) {
      card.classList.add("selected");
    }
    
    card.innerHTML = `
      <input type="checkbox" value="${trait}" ${selectedTraits.includes(trait) ? 'checked' : ''} data-testid="checkbox-trait-${trait.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
      <div class="trait-info">
        <div class="trait-name">${traitInfo.name}</div>
        <div class="trait-meta">
          <span>● ${questionCount} questions</span>
          <span>● ~${estimatedTime} min</span>
        </div>
      </div>
    `;
    
    const checkbox = card.querySelector('input');
    checkbox.addEventListener('change', () => {
      card.classList.toggle('selected', checkbox.checked);
      updateTimeEstimate();
    });
    
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
    
    checkboxDiv.appendChild(card);
  });
  
  updateTimeEstimate();
}

function updateTimeEstimate() {
  const checkboxes = document.querySelectorAll("#traitCheckboxes input[type='checkbox']");
  const checkedTraits = Array.from(checkboxes).filter(cb => cb.checked);
  
  if (checkedTraits.length === 0) {
    document.getElementById("timeEstimate").textContent = "Select at least one trait";
    return;
  }
  
  let totalQuestions = 0;
  checkedTraits.forEach(cb => {
    totalQuestions += traits[cb.value].length;
  });
  
  const totalMinutes = Math.ceil(totalQuestions * MINUTES_PER_QUESTION);
  document.getElementById("timeEstimate").textContent = `~${totalMinutes} minutes (${totalQuestions} questions)`;
}

// Modal handling
const modal = document.getElementById("privacyModal");
const privacyBtn = document.getElementById("privacyBtn");
const closeBtn = document.getElementsByClassName("close")[0];

privacyBtn.onclick = () => {
  modal.style.display = "block";
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Start assessment
function startAssessment() {
  const checkboxes = document.querySelectorAll("#traitCheckboxes input[type='checkbox']");
  selectedTraits = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
  
  if (selectedTraits.length === 0) {
    alert("Please select at least one trait to assess.");
    return;
  }

  answers = {};
  selectedTraits.forEach(trait => {
    answers[trait] = {};
  });

  let allQuestions = [];
  for (const trait of selectedTraits) {
    traits[trait].forEach(q => {
      allQuestions.push({ ...q, trait: trait });
    });
  }
  
  allQuestions = shuffleArray(allQuestions);

  allQuestionsData = {};
  allQuestions.forEach(q => {
    allQuestionsData[q.id] = q;
  });

  const assessmentDiv = document.getElementById("assessment");
  assessmentDiv.innerHTML = "";
  
  allQuestions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.className = "card";
    qDiv.innerHTML = `
      <h3>Question ${index + 1} of ${allQuestions.length}</h3>
      <h4 style="color:hsl(var(--text-tertiary)); font-weight:normal; margin-top:5px;">${q.id}</h4>
      <p>${q.text}</p>
    `;
    
    q.options.forEach((opt, optIndex) => {
      const label = document.createElement("label");
      label.className = "option-label";
      label.innerText = opt.label;
      label.dataset.testid = `option-${q.id}-${optIndex}`;
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = q.id;
      radio.value = opt.value;
      radio.style.display = "none";
      
      radio.onchange = () => {
        label.parentNode.querySelectorAll(".option-label").forEach(l => l.classList.remove("selected"));
        label.classList.add("selected");
        answers[q.trait][q.id] = parseFloat(radio.value);
        document.getElementById("calculateBtn").disabled = !checkAllAnswered();
      };
      
      label.appendChild(radio);
      qDiv.appendChild(label);
    });
    
    assessmentDiv.appendChild(qDiv);
  });

  document.getElementById("traitSelection").style.display = "none";
  document.getElementById("assessment").style.display = "block";
  document.getElementById("assessmentButtons").style.display = "flex";
  document.getElementById("results").innerHTML = "";
  document.getElementById("downloadBtn").style.display = "none";
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById("startBtn").onclick = startAssessment;

document.getElementById("changeTraitsBtn").onclick = () => {
  if (confirm("Changing traits will reset your current answers. Are you sure?")) {
    document.getElementById("traitSelection").style.display = "block";
    document.getElementById("assessment").style.display = "none";
    document.getElementById("assessmentButtons").style.display = "none";
    document.getElementById("results").innerHTML = "";
    renderTraitSelection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function checkAllAnswered() {
  for (const trait of selectedTraits) {
    for (const q of traits[trait]) {
      if (answers[trait][q.id] === undefined) return false;
    }
  }
  return true;
}

// Calculate results and call Python backend for GPT analysis
document.getElementById("calculateBtn").onclick = async () => {
  document.getElementById("assessment").style.display = "none";
  
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Analyzing your responses with AI...</p></div>';

  // Prepare data for backend
  const assessmentData = {
    selectedTraits: selectedTraits,
    answers: answers,
    traitData: {}
  };

  // Include trait definitions and question data
  selectedTraits.forEach(trait => {
    assessmentData.traitData[trait] = {
      questions: traits[trait],
      interpretation: traitInterpretations[trait],
      patterns: patternInterpretations[trait]
    };
  });

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assessmentData)
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    const result = await response.json();
    
    // Display results
    resultsDiv.innerHTML = result.html;
    
    // Re-attach event listeners for expandable sections
    attachExpandListeners();
    
    document.getElementById("downloadBtn").style.display = "inline-block";
    
  } catch (error) {
    console.error('Error:', error);
    resultsDiv.innerHTML = `
      <div class="card" style="background: hsl(var(--warning) / 0.1); border-color: hsl(var(--warning));">
        <h3 style="color: hsl(var(--warning));">Analysis Error</h3>
        <p>Sorry, there was an error analyzing your responses. Please try again.</p>
        <p style="font-size: 13px; color: hsl(var(--text-tertiary));">Error: ${error.message}</p>
      </div>
    `;
  }
};

function attachExpandListeners() {
  // Re-attach toggle listeners for dynamically loaded content
  document.querySelectorAll('.result-header').forEach(header => {
    header.onclick = function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('.toggle-icon');
      content.classList.toggle('expanded');
      icon.classList.toggle('expanded');
    };
  });

  document.querySelectorAll('.analysis-section h4').forEach(header => {
    header.onclick = function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('.toggle-icon');
      if (content && icon) {
        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
      }
    };
  });
}

// Download report functionality
let cachedResults = null;
let cachedOverallAssessment = null;
let cachedTraitAnalyses = null;
let cachedTraitData = null;

document.getElementById("downloadBtn").onclick = async () => {
  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selectedTraits: selectedTraits,
        answers: answers,
        results: cachedResults,
        overallAssessment: cachedOverallAssessment,
        traitAnalyses: cachedTraitAnalyses,
        traitData: cachedTraitData
      })
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personality-assessment-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error('Error:', error);
    alert('Sorry, there was an error generating your PDF. Please try again.');
  }
};

// Initialize
renderTraitSelection();
