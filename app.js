let questions = [], current = 0, userAnswers = [], flagged = new Set(), sectionTime = 21*60;
fetch('questions.json').then(r=>r.json()).then(qs=>{ questions=qs; initPalette(); startTimer(); renderQuestion(); });
function startTimer(){
  const el=document.getElementById('timer'); let t=sectionTime;
  setInterval(()=>{
    if(t<=0) return;
    t--; const m=String(Math.floor(t/60)).padStart(2,'0'), s=String(t%60).padStart(2,'0');
    el.textContent=`${m}:${s}`;
  },1000);
}
function renderQuestion(){
  const q=questions[current];
  document.getElementById('section-name').textContent=q.section;
  document.getElementById('question-counter').textContent=`Q${current+1} of ${questions.length}`;
  document.getElementById('question-text').textContent=q.stem;
  const form=document.getElementById('options-form');
  form.innerHTML='';
  q.options.forEach((opt,i)=>form.insertAdjacentHTML('beforeend',`
    <div class="form-check">
      <input class="form-check-input" type="radio" name="option" id="o${i}" value="${i}"
        ${userAnswers[current]===i?'checked':''}>
      <label class="form-check-label" for="o${i}">${opt}</label>
    </div>`));
  document.querySelectorAll('#palette button').forEach((btn,i)=>{
    btn.classList.toggle('active', i===current);
    btn.classList.toggle('review', flagged.has(i));
  });
}
function initPalette(){
  const pal=document.getElementById('palette');
  questions.forEach((_,i)=>{
    const b=document.createElement('button');
    b.textContent=i+1; b.className='btn';
    b.onclick=()=>{ saveAnswer(); current=i; renderQuestion(); };
    pal.appendChild(b);
  });
}
function saveAnswer(){
  const sel=document.querySelector('input[name="option"]:checked');
  userAnswers[current]=sel?+sel.value:null;
}
// Navigation buttons
document.getElementById('prevBtn').onclick = () => {
  saveAnswer();
  if (current > 0) current--;
  renderQuestion();
};
document.getElementById('nextBtn').onclick = () => {
  saveAnswer();
  if (current < questions.length - 1) current++;
  renderQuestion();
};

// Flag for review button
const flagBtn = document.getElementById('flagBtn');
flagBtn.onclick = () => {
  // Toggle the current question’s flag state
  if (flagged.has(current)) flagged.delete(current);
  else flagged.add(current);

  // Update the flag button’s look
  flagBtn.classList.toggle('flagged', flagged.has(current));

  // Update the palette highlight
  renderQuestion();
};

 
