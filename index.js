let activeStep = 0
const steps = document.querySelectorAll('.form-step')
const backBtn = document.getElementById('back-btn')
const nextBtn = document.getElementById('next-btn')
const sideNavItems = document.querySelectorAll('.step-number')
const plansPerMonth = document.querySelectorAll('.perm')
const plansPerYear = document.querySelectorAll('.pery')
const duration = document.getElementById('duration')
const plans = [
  {
    id: '01',
    name: 'Arcade',
    monthly_price: '9',
    yearly_price: '90'
  },
  {
    id: '02',
    name: 'Advanced',
    monthly_price: '12',
    yearly_price: '120'
  },
  {
    id: '03',
    name: 'Pro',
    monthly_price: '15',
    yearly_price: '150'
  }
]

const addOns = [
  {
    name: 'add_on_online',
    price: '1'   
  },
  {
    name: 'add_on_customizable',
    price: '2' 
  },
  {
    name: 'add_on_storage',
    price: '3' 
  }
]

let formData = {}

window.addEventListener('DOMContentLoaded', (e) => {
  initForm()
})

function initForm(){
  registerEvents();
  displayFormStep();
  managePlanPrices(duration.checked);
}

function registerEvents(){
  backBtn.addEventListener('click', (e) => {
    previousStep()
  })
  
  nextBtn.addEventListener('click', (e) => {
    nextStep(e)
  })

  duration.addEventListener('change', (e) => {
    managePlanPrices(e.target.checked)
  })
}

function showBtn(btn){
  btn.classList.remove('hidden')
}

function hideBtn(btn){
  btn.classList.add('hidden')
}

function removeAllChildNodes(node){
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

function navigateToStep(step){
  activeStep = step
  nextStep()
}

function createSubItem(subItemObj){
  let subItem = document.createElement('div')
  subItem.classList.add('sub-item')
  let subItemName = document.createElement('h3')
  subItemName.classList.add('font-bold', 'sub-item-name')
  subItemName.textContent = subItemObj.name
  let subItemPrice = document.createElement('p')
  subItemPrice.classList.add('font-bold', 'sub-item-price')
  subItemPrice.textContent = `$${subItemObj.price}`

  subItem.appendChild(subItemName)
  subItem.appendChild(subItemPrice)
  
  return subItem
}

function displayFormStep(){
  steps.forEach((stp) => {
    stp.classList.remove('visible')
    stp.classList.add('hidden')
  })
 
  steps[activeStep].classList.add('visible')
  manageBtns()
  if(activeStep <= steps.length - 2) manageSideNav();
}

function displayUserData(){
  const subItems = document.getElementById('sub-items')
  removeAllChildNodes(subItems)
  let planItem = createSubItem(formData.plan)
  let linkToStep2 = document.createElement('button')
  linkToStep2.classList.add('bg-transparent', 'change-btn')
  linkToStep2.onclick = () => navigateToStep(0)
  linkToStep2.textContent = 'Change'
  planItem.firstChild.appendChild(linkToStep2)
  subItems.append(planItem)
  subItems.append(document.createElement('hr'))

  formData.addons.forEach((addon) => {
    subItems.append(createSubItem(addon))
  })

  const addOnsPrice = formData.addons.length > 0 
    ? formData.addons.reduce((prev, curr) => prev + Number(curr.price), 0)
    : 0
  const total = Number(formData.plan.price) + 
    addOnsPrice 
      
  
  const totalItem = createSubItem({name: 'Total', price: total})
  subItems.append(totalItem)
}

function manageFormData(){
  console.log(activeStep);
  let form
  switch (activeStep) {
    case 1:
      form = new FormData(document.getElementById('form-step-1'))
      formData.user = {
        'name': form.get('name'),
        'email': form.get('email'),
        'phone': form.get('phone')
      } 
      break;

    case 2:
      form = new FormData(document.getElementById('form-step-2'))
      let plan = plans.find((p) => p.id == form.get('plan_name'))
      formData.plan = {
        'name': plan.name,
        'price': !form.get('plan_duration') 
          ? plan.monthly_price
          : plan.yearly_price,
      }
      break;

    case 3:
      form = new FormData(document.getElementById('form-step-3'))
      formData.addons = []
      for(const pair of form.entries()){
        let addOn = addOns.find((ad)=>ad.name === pair[0]) 
        formData['addons'].push({
          name: addOn.name,
          price: addOn.price
        })
      }

      displayUserData()
      break;

    default:
      break;
  }
}

function nextStep(e){
  e.preventDefault()
  if(e.target.form.checkValidity()){
    activeStep += 1
    manageFormData()
    displayFormStep()
  }
  else{
    e.target.form.reportValidity()
  }
}

function previousStep(){
  activeStep -= 1
  displayFormStep()
}

function manageBtns() {
  if(activeStep < steps.length - 2){
    nextBtn.setAttribute('form',`form-step-${activeStep + 1}`)
  }

  if (activeStep == 0) {
    hideBtn(backBtn)
  }
  else if (activeStep == (steps.length - 1)){
    hideBtn(nextBtn)
  }
  else {
    showBtn(nextBtn)
    showBtn(backBtn)
  }
}

function manageSideNav(){
  sideNavItems.forEach((item) => {
    item.classList.remove('bg-blue')
    item.classList.add('bg-transparent')
  })

  sideNavItems[activeStep].classList.replace('bg-transparent', 'bg-blue')
}

function managePlanPrices(yearly){
  console.log(yearly);
  if(yearly){
    plansPerMonth.forEach((plan) => {
      plan.classList.remove('visible')
      plan.classList.add('hidden')
    })
    plansPerYear.forEach((plan) => {
      plan.classList.remove('hidden')
      plan.classList.add('visible')
    })
  }
  else{
    plansPerYear.forEach((plan) => {
      plan.classList.remove('visible')
      plan.classList.add('hidden')
    })
    plansPerMonth.forEach((plan) => {
      plan.classList.remove('hidden')
      plan.classList.add('visible')
    })
  }
}
