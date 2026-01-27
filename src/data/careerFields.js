import img1 from "../assets/resources/img1.avif";
import img2 from "../assets/resources/img2.avif";
import img3 from "../assets/resources/img3.avif";
import img4 from "../assets/resources/img4.avif";
import img5 from "../assets/resources/img5.avif";
import img6 from "../assets/resources/img6.avif";
import img7 from "../assets/resources/img7.avif";
import img8 from "../assets/resources/img8.avif";
import img9 from "../assets/resources/img9.avif";
import img10 from "../assets/resources/img10.avif";
import img11 from "../assets/resources/img11.avif";

export const careerFields = [
  {
    name: "Medical Imaging", //! MEDICAL IMAGING
    description: "MRI, CT, Image Reconstruction/Enhancement Techniques",
    image: img1,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 }, // No bottom margin
      { section: "external_professors", marginBottom: 6 }, // No bottom margin
      { section: "companies", marginBottom: 0 }, // No bottom margin
    ],
    uf_research_professors: [
      {
        name: "Dr. Ruogu Fang (BME)",
        linkedin: "https://www.linkedin.com/in/ruogu-fang-a015bb15/",
        lab: "https://lab-smile.github.io/",
      },
      {
        name: "Dr. Wesley Bolch (BME)",
        linkedin: "https://www.linkedin.com/in/wesley-bolch-68b80618/",
        lab: "https://medphysics.med.ufl.edu/medical-physics-graduate-program/faculty-facilities/research-labs/advanced-laboratory-for-radiation-dosimetry-studies/",
      },
      {
        name: "Dr. Kuang Gong (BME)",
        linkedin: "https://www.linkedin.com/in/kuang-gong-49501223/",
        lab: "https://gong-lab.com/",
      },
      {
        name: "Dr. Pinaki Sarder (ECE)",
        linkedin: "https://www.linkedin.com/in/pinaki-sarder-94a9b99/",
        lab: "https://cmilab.nephrology.medicine.ufl.edu/",
      },
      {
        name: "Dr. Baba C. Vemuri (CISE)",
        linkedin: "https://www.linkedin.com/in/baba-vemuri-22955545/",
        lab: "https://www.cise.ufl.edu/~vemuri/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Peirong Liu (Johns Hopkins)",
        linkedin: "https://www.linkedin.com/in/peirongliu/",
        lab: "https://peirong26.github.io/",
      },
    ],
    companies: [
      "GE Healthcare",
      "NVIDIA Healthcare",
      "Siemens Healthineers",
      "Johnson & Johnson MedTech",
      "Philips Healthcare",
    ],
    skills: [
      "Image Processing",
      "Python",
      "MATLAB",
      "Signal Processing",
      "Machine Learning",
      "Medical Physics",
      "3D Visualization",
      "MONAI",
      "PyTorch",
      "TensorFlow",
      "Keras",
    ],
    classes: [
      "BME4531 - Medical Imaging",
      "EEL4930/5934 - Special Topics in Electrical Engineering: Intro Biomedical Image Analysis",
      "EEL6935 - Special Topics in Electrical Engineering: Deep Learning in Medical Image Analysis",
      "BME6535 - Radiological Physics, Measurements and Dosimetry",
    ],
    projectIdeas: [
      {
        text: "Develop a deep-learning model to classify MRI brain scans for early tumor detection (glioma, meningioma, pituitary, no-tumor).",
        links: [
          {
            url: "https://github.com/HalemoGPA/BrainMRI-Tumor-Classifier-Pytorch?utm_source=chatgpt.com",
            type: "github",
          },
          {
            url: "https://github.com/NassarX/brain-tumor-mri-classifier?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Create a web-based DICOM viewer with 2D/3D rendering, annotation tools, and support for streaming medical imaging data.",
        links: [
          {
            url: "https://github.com/OHIF/Viewers?utm_source=chatgpt.com",
            type: "github",
          },
          {
            url: "https://docs.ohif.org/development/getting-started/?utm_source=chatgpt.com",
            type: "documentation",
          },
        ],
      },
      {
        text: "Build an end-to-end segmentation and classification pipeline for brain MRI: load dataset → preprocess → train model → deploy web app interface.",
        links: [
          {
            url: "https://github.com/tristan-rech/MRI-Brain-Tumor-Detection?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Implement a transfer-learning based MRI classification project (e.g., using EfficientNet) with data-prep, augmentation, training and deployment.",
        links: [
          {
            url: "https://github.com/zacharyvunguyen/Brain-Tumor-MR-Image-Classification-using-Transfer-Learning-with-EfficientNet-?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
    ],
  },
  {
    name: "Signal Processing", //! SIGNAL PROCESSING
    description: "ECG, EEG, Biosignal Analysis/Manipulation",
    image: img2,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    uf_research_professors: [
      {
        name: "Dr. Mingzhou Ding (BME)",
        linkedin: "https://www.linkedin.com/in/mingzhou-ding-6a348a88/",
        lab: "https://bme.ufl.edu/dept-member/ding_mingzhou/",
      },
      {
        name: "Dr. Nicholas Napoli (ECE)",
        linkedin:
          "https://www.linkedin.com/in/nicholas-joseph-napoli-phd-26238b24/",
        lab: "https://hippo.ece.ufl.edu/",
      },
    ],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: [
      "Texas Instruments",
      "Analog Devices",
      "PLUX",
      "NASA Human Health and Performance",
    ],
    skills: ["Python", "MATLAB", "Signal Processing", "Linear Algebra"],
    classes: [
      "EEL3135 - Introduction to Signals and Systems",
      "EEL4750/EEE5502 - Foundations of Digital Signal Processing",
      "EEE4511 - Real-time DSP Applications",
      "EEL3008 - Physics of Electrical Engineering",
      "BME3508 - Biosignals and Systems",
      "BME4503 - Biomedical Instrumentation",
      "EEL6537 - Spectrum Sensing and Sparse Signal Recovery",
      "EEE5283 - Neural Signals, Systems and Technology",
      "BME6522 - Multivariate Biomedical Signal Processing",
    ],
    projectIdeas: [
      {
        text: "Design a real-time ECG signal filter and heart-rate variability (HRV) analyzer for wearable devices.",
        links: [
          {
            url: "https://biosppy.readthedocs.io/en/stable/tutorial.html?utm_source=chatgpt.com",
            type: "tutorial",
          },
          {
            url: "https://github.com/PIA-Group/BioSPPy?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Implement an EEG-based brain-computer interface (BCI) for controlling a robotic arm (or device) by decoding motor-imagery signals.",
        links: [
          {
            url: "https://github.com/sccn/eeglab?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Build an EMG (electromyogram) signal analysis pipeline to detect early signs of muscle fatigue in athletes, using time-frequency analysis and machine learning.",
        links: [
          {
            url: "https://spkit.github.io/?utm_source=chatgpt.com",
            type: "documentation",
          },
        ],
      },
      {
        text: "Create a mobile app for remote heart-rate variability monitoring via biosignals (ECG/PPG) and provide live analytics/alerts for user stress or fatigue.",
        links: [
          {
            url: "https://en.wikipedia.org/wiki/NeuroKit?utm_source=chatgpt.com",
            type: "wikipedia",
          },
          {
            url: "https://support.pluxbiosignals.com/knowledge-base/do-you-know-any-open-source-software-for-biosignal-processing/?utm_source=chatgpt.com",
            type: "documentation",
          },
        ],
      },
    ],
  },
  {
    name: "Medical Devices", //! MEDICAL DEVICES
    description: "Pacemakers, Smart Prosthetics, Artificial Pancreas",
    image: img3,
    sectionsInColumn: [
      { section: "uf_teaching_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 4 },
    ],
    // uf_research_professors: [],
    uf_teaching_professors: [
      {
        name: "Dr. Mansy",
        linkedin: "https://www.linkedin.com/in/maymansy/",
      },
    ],
    // external_professors: [],
    companies: [
      "Johnson & Johnson MedTech",
      "Medtronic",
      "Arthrex",
      "Edwards Lifesciences",
      "Texas Instruments",
      "Boston Scientific",
    ],
    skills: [
      "PCB Design",
      "Circuit Design",
      "KiCAD",
      "LTspice",
      "Oscilloscope",
      "SolidWorks",
      "AutoCAD",
      "3D Printing",
      "Prototyping",
      "Microprocessors",
    ],
    classes: ["BME4503 - Biomedical Instrumentation"],
    projectIdeas: [
      {
        text: "PDevelop a low-cost ECG monitor (PCB + microcontroller + serial data output) for real-time heart-rate detection and logging.",
        links: [
          {
            url: "https://arxiv.org/abs/2204.00513?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Prototype a 3D-printed smart prosthetic limb with myoelectric (EMG) input and servo-actuated fingers for everyday tasks.",
        links: [
          {
            url: "https://takeoffprojects.com/page/blog/biomedical-instrumentation-projects?utm_source=chatgpt.com",
            type: "blog",
          },
          {
            url: "https://takeoffprojects.com/page/blog/top7-biomedical-projects-for-students?utm_source=chatgpt.com",
            type: "blog",
          },
        ],
      },
      {
        text: "Build a wearable respiratory rate + SpO₂ monitoring patch for remote patient monitoring (IoT + BLE + cloud dashboard).",
        links: [
          {
            url: "https://takeoffprojects.com/page/blog/top7-biomedical-projects-for-students?utm_source=chatgpt.com",
            type: "blog",
          },
          {
            url: "https://takeoffprojects.com/page/blog/biomedical-instrumentation-projects?utm_source=chatgpt.com",
            type: "blog",
          },
        ],
      },
      {
        text: "Design an open‐source ventilator prototype (mechanical compression of manual resuscitator + sensors + microcontroller) for emergency situations.",
        links: [
          {
            url: "https://en.wikipedia.org/wiki/Open-source_ventilator?utm_source=chatgpt.com",
            type: "wikipedia",
          },
          {
            url: "https://arxiv.org/abs/2012.13005?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
    ],
  },
  {
    name: "Neuroengineering", //! NEUROENGINEERING
    description: "Neuromodulation, Computational Neuroscience",
    image: img4,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 },
      { section: "external_professors", marginBottom: 6 },
    ],
    uf_research_professors: [
      {
        name: "Dr. Aprinda I. Queen (Public Health)",
        linkedin: "https://www.linkedin.com/in/aprinda/",
        lab: "https://mbi.ufl.edu/tag/aprinda-i-queen/",
      },
      {
        name: "Dr. Jack Judy (ECE)",
        linkedin: "https://www.linkedin.com/in/jack-judy/",
        lab: "https://judylab.ece.ufl.edu/",
      },
      {
        name: "Dr. Karim Oweiss (ECE)",
        linkedin: "https://www.linkedin.com/in/karim-oweiss-49221314/",
        lab: "https://oweisslab.ece.ufl.edu/",
      },
      {
        name: "Dr. Adam Khalifa (ECE)",
        linkedin: "https://www.linkedin.com/in/adam-khalifa-bb62b6138/",
        lab: "https://www.khalifaadam.com/",
      },
      {
        name: "Dr. Erin Patrick (ECE)",
        linkedin: "https://www.linkedin.com/in/erin-patrick-6921a913/",
        lab: "https://epatrick.ece.ufl.edu/home/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Krishna Jayant (Purdue)",
        linkedin: "https://www.linkedin.com/in/krishna-jayant/",
        lab: "https://nanoneurotech.com/",
      },
      {
        name: "Dr. George Malliaras (Cambridge)",
        linkedin:
          "https://www.linkedin.com/in/georgemalliaras/?originalSubdomain=uk",
        lab: "https://bioelectronics.eng.cam.ac.uk/",
      },
      {
        name: "Dr. Sergey Stavisky (UC Davis)",
        linkedin: "https://www.linkedin.com/in/sergey-stavisky-2aab924/",
        lab: "https://neuroprosthetics.science/",
      },
      {
        name: "Dr. David Brandman (UC Davis)",
        linkedin: "https://www.linkedin.com/in/david-brandman-md-phd-4172b973/",
        lab: "https://neuroprosthetics.science/",
      },
      {
        name: "Dr. Tomasz M. Rutkowski (Tokyo)",
        linkedin:
          "https://www.linkedin.com/in/tomasz-maciej-rutkowski/?originalSubdomain=jp",
        lab: "https://tomek.bci-lab.info/",
      },
    ],
    companies: [
      "Blackrock Neurotech",
      "Precision Neuroscience",
      "Neurolink",
      "Paradronics",
    ],
    skills: ["Signal Processing", "Python", "Machine Learning"],
    classes: ["EEE4260 - Bioelectrical Systems"],
    projectIdeas: [
      {
        text: "Create a brain–computer interface (BCI) that uses EEG signals to control a simple robotic arm or game interface (e.g., motor-imagery or P300).",
        links: [
          {
            url: "https://openbci.com/community/category/tutorials/?utm_source=chatgpt.com",
            type: "tutorial",
          },
        ],
      },
      {
        text: "Build a custom EEG/EMG recording system (hardware + software) using the OpenBCI board, capture signals, preprocess and classify them (e.g., detecting imagined movement vs. rest).",
        links: [
          {
            url: "https://docs.openbci.com/GettingStarted/Boards/CytonGS/?utm_source=chatgpt.com",
            type: "documentation",
          },
          {
            url: "https://docs.openbci.com/GettingStarted/GettingStartedLanding/?utm_source=chatgpt.com",
            type: "documentation",
          },
        ],
      },
      {
        text: "Implement a neuroprosthetic control algorithm: take recorded EEG/EMG data, train a classifier or regression model, and map the output to actuate a prosthetic or assistive device.",
        links: [
          {
            url: "https://digitalcommons.usf.edu/cgi/viewcontent.cgi?article=11144&context=etd&utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
      {
        text: "Develop a software pipeline for neural signal preprocessing + feature extraction + classification for EEG/MEG data (e.g., functional connectivity analysis, source reconstruction).",
        links: [
          {
            url: "https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2020.00710/full?utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
    ],
  },
  {
    name: "AI & ML", //! AI & ML
    description:
      "Digital twins, Precision Medicine, Predictive Analytics/Diagnosis",
    image: img5,
    sectionsInColumn: [
      { section: "uf_teaching_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    // uf_research_professors: []
    uf_teaching_professors: [
      {
        name: "Dr. Catia Silva (ECE)",
        linkedin: "https://www.linkedin.com/in/c%C3%A1tia-silva-a9215430/",
      },
    ],
    // external_professors: [],
    companies: ["IBM Digital Health", "Microsoft Research", "Verily"],
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Machine Learning",
      "Computer Vision",
      "Deep Learning",
      "Natural Language Processing",
    ],
    classes: [
      "EEL3872 - Artificial Intelligence Fundamentals",
      "EEE3773 - Introduction to Machine Learning",
      "EEE4773 - Fundamentals of Machine Learning",
      "EEL5934 - Special Topics in Electrical Engineering:Applied Machine Learning Systems",
      "EGN5216 - Machine Learning for AI Systems",
      "EGN6216 - Artificial Intelligence Systems",
      "CAP5416 - Computer Vision",
      "EEL4403/5406 - Computational Photography",
      "EEE6512 - Image Processing and Computer Vision",
      "EGN6217 - Applied Deep Learning",
    ],
    projectIdeas: [
      {
        text: "Build a predictive analytics model for patient readmission using EHR (electronic health record) data and deploy a simple interface for clinicians.",
        links: [
          {
            url: "https://arxiv.org/abs/2101.04209?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Develop a deep-learning system for multi-modal data (e.g., images + clinical text) for disease diagnosis and risk stratification.",
        links: [
          {
            url: "https://github.com/microsoft/healthcareai-examples?utm_source=chatgpt.com",
            type: "github",
          },
          {
            url: "https://microsoft.github.io/healthcareai-examples/?utm_source=chatgpt.com",
            type: "website",
          },
        ],
      },
      {
        text: "Create a medical chatbot or LLM-based assistant for patient education or symptom triage using publicly available health datasets.",
        links: [
          {
            url: "https://github.com/AI-in-Health/MedLLMsPracticalGuide?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Build a classification pipeline for diagnosing diseases (e.g., diabetes, heart disease) from tabular clinical data, including full data cleaning, feature engineering, model training and evaluation.",
        links: [
          {
            url: "https://github.com/edaaydinea/AI-Projects-for-Healthcare?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
    ],
  },
  {
    name: "Bioinformatics & Genomics", //! BIOINFORMATICS & GENOMICS
    description: "Computational Genomics, Multi-omics data, Synthetic Biology",
    image: img6,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 },
      { section: "external_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    uf_research_professors: [
      {
        name: "Dr. Xiao Fan (BME)",
        linkedin: "https://www.linkedin.com/in/xiao-fan-26520625/",
        lab: "https://xiaofan-lab.github.io/",
      },
      {
        name: "Dr. Tamer Kahveci (CISE)",
        linkedin: "https://www.linkedin.com/in/tamer-kahveci-3a210111/",
        lab: "https://www.cise.ufl.edu/~tamer/",
      },
      {
        name: "Dr. Kiley Graim (BME)",
        linkedin: "https://www.linkedin.com/in/kiley-graim-5a8510b/",
        lab: "https://graimlab.org/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Ernest Fraenkel (MIT)",
        linkein: "https://www.linkedin.com/in/ernest-fraenkel-22982b162/",
        lab: "https://fraenkel.mit.edu/",
      },
    ],
    companies: ["IBM Digital Health", "The DNA Company"],
    skills: ["N/A"],
    classes: [
      "BSC2891 - Python Programming for Biologists",
      "BSC4434C - Introduction to Bioinformatics",
      "MCB4320C - The Microbiome",
      "BSC4913 - Independent Research in Bioinformatics",
      "MAP4484/5489 - Modeling in Mathematical Biology",
      "PCB3063 - Genetics",
      "PCB4674 - Evolution ",
      "PCB5065 - Advanced Genetics",
      "MCB4934 - Special Topics in Microbiology and Cell Science (Advanced Bioinformatics)",
    ],
    projectIdeas: [
      {
        text: "Build a sequence-analysis pipeline (FASTQ → alignment → variant calling → annotation) and visualize results for a small genome dataset.",
        links: [
          {
            url: "https://github.com/evanpeikon/Bioinformatics_Toolkit?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Create a multi-omics data integration workflow (e.g., RNA-seq + methylation + proteomics) using publicly available datasets and machine learning to classify disease vs. healthy samples.",
        links: [
          {
            url: "https://bioinformaticsworkbook.org/?utm_source=chatgpt.com#gsc.tab=0",
            type: "website",
          },
        ],
      },
      {
        text: "Develop a tool to detect and visualize structural genomic variation (e.g., copy number variation or pangenome) from microbial genome sets, then build an interactive dashboard.",
        links: [
          {
            url: "https://www.reddit.com/r/bioinformatics/comments/zsbwy5/looking_for_beginner_bioinformatics",
            type: "reddit",
          },
        ],
      },
      {
        text: "Design a reproducible bioinformatics project (Bash + Python/R) that downloads a public dataset (e.g., GEO/SRA), processes it (e.g., differential expression), and publishes results with a well-documented GitHub repo.",
        links: [
          {
            url: "https://alexanderlabwhoi.github.io/BVCNReproducibility/02/2/organizing.html?utm_source=chatgpt.com",
            type: "website",
          },
        ],
      },
    ],
  },
  {
    name: "Digital Health & Wearables", //! DIGITAL HEALTH & WEARABLES
    description: "Smartwatches, Telehealth",
    image: img7,
    sectionsInColumn: [
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    // uf_research_professors: [],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: [
      "Apple",
      "Samsung",
      "FitBit",
      "Google",
      "Magic Leap",
      "Microsoft (HoloLens)",
    ],
    skills: ["Signal Processing"],
    classes: [
      "HSC4064 - Wearable Technology, Robotics, and Artificial Intelligence for Health",
      "DIG4634 - Wearable and Mobile App Development",
      "HSA4191 - Health Informatics & Emerging Healthcare Technologies",
    ],
    projectIdeas: [
      {
        text: "Build a wearable IoT health-monitoring system (e.g., smartwatch or band) that tracks vitals (heart rate, SpO₂, temperature) and streams data to a cloud dashboard.",
        links: [
          {
            url: "https://github.com/PiyushRaj714/IoT-based-health-monitoring-system?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Design a smart wearable device (e.g., wrist band) for elderly care: fall detection + vital sign monitoring + GPS tracking for Alzheimer’s patients.",
        links: [
          {
            url: "https://github.com/Noora-Alhajeri/Wearable-IoT-Based-Device-for-Critical-Care-Alzheimer-s-Patients?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Create an open-source smartwatch (hardware + firmware + mobile app) focusing on health features: ECG, SpO₂, activity tracking, custom modifiable wearable platform.",
        links: [
          {
            url: "https://github.com/Lemme-lab/Project-Airframe?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Develop a mobile app + wearable sensor system to enable remote patient monitoring via smartwatches and wearables for chronic condition management (data capture → analysis → alert).",
        links: [
          {
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10625201/?utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
    ],
  },
  {
    name: "Healthcare Robotics", //! HEALTHCARE ROBOTICS
    description: "Surgical Robotics, Autonomous Labs",
    image: img8,
    sectionsInColumn: [
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    // uf_research_professors: [],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: ["Intuitive", "Disney Research", "Figure", "Humanoid"],
    skills: ["FPGA", "Microprocessors", "Circuitry"],
    classes: [
      "HSC4064 - Wearable Technology, Robotics, and Artificial Intelligence for Health",
    ],
    projectIdeas: [
      {
        text: "Create an image-guided robotic assistant for needle insertion in simulated anatomy.",
        links: [
          {
            url: "https://rosmed.github.io/?utm_source=chatgpt.com",
            type: "website",
          },
          {
            url: "https://rosmed.github.io/tutorials/?utm_source=chatgpt.com",
            type: "tutorial",
          },
        ],
      },
      {
        text: "Build a low-cost continuum manipulator (flexible robot arm) for minimally-invasive surgical simulation, with CAD, control code & actuation.",
        links: [
          {
            url: "https://arxiv.org/abs/2101.01080?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Implement an autonomous robotic platform for endovascular navigation (catheter/guidewire) in simulation, training via reinforcement learning.",
        links: [
          {
            url: "https://arxiv.org/abs/2208.01455?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Develop a medical-robotics pipeline using simulation + real robot: from digital twin to deployment, for e.g., autonomous ultrasound probe manipulation.",
        links: [
          {
            url: "https://developer.nvidia.com/blog/introducing-nvidia-isaac-for-healthcare-an-ai-powered-medical-robotics-development-platform/?utm_source=chatgpt.com",
            type: "blog",
          },
        ],
      },
    ],
  },
  {
    name: "Modeling & Simulation", //! MODELING & SIMULATION
    description:
      "Computational Modeling of Organs, In-silico clinical trials, Finite Element Analysis",
    image: img9,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    uf_research_professors: [
      {
        name: "Dr. Markus Santoso (DAS)",
        linkedin: "https://www.linkedin.com/in/markus-santoso-779172354/",
        lab: "https://ufblockchain.org/markus-santoso/",
      },
      {
        name: "Dr. Angelos Barmpoutis (DAS)",
        linkedin: "https://www.linkedin.com/in/angelos-barmpoutis-147b19a/",
        lab: "https://codingplusfun.com/",
      },
    ],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: ["Relevate Health", "Dassault Systèmes", "Ansys"],
    skills: ["Unity", "Virtual Reality", "Augmented Reality"],
    classes: [
      "EGM4585 - Modeling and Control of Biomolecular Machines",
      "EGM4590 - Biodynamics",
      "EGM4592 - Bio-Solid Mechanics",
      "ABE5643C - Biological Systems Modeling",
      "ABE5646 - Biological and Agricultural Systems Simulation",
    ],
    projectIdeas: [
      {
        text: "Develop a musculoskeletal simulation of human gait (load input data → build model in a biomechanics engine → run forward/inverse dynamics to analyze joint/muscle forces).",
        links: [
          {
            url: "https://nmbl.stanford.edu/publications/pdf/Delp2007.pdf?utm_source=chatgpt.com",
            type: "article",
          },
          {
            url: "https://en.wikipedia.org/wiki/OpenSim_%28simulation_toolkit%29?utm_source=chatgpt.com",
            type: "wikipedia",
          },
        ],
      },
      {
        text: "Build a multiscale agent-based simulation of a multicellular biological process (cells + extracellular signaling + tissue dynamics) using a declarative modelling engine.",
        links: [
          {
            url: "https://morpheus.gitlab.io/?utm_source=chatgpt.com",
            type: "website",
          },
        ],
      },
      {
        text: "Create a large-scale individual-level health simulation (simulate many virtual individuals over time, track disease progression, interventions, population metrics).",
        links: [
          {
            url: "https://microsimulation.pub/articles/00240?utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
      {
        text: "Develop a book-keeping and reproducible modelling workflow: download public biological/system-data, implement a dynamic model in SBML (or similar), run simulations, analyze parameter impact and produce ready-to-use reports.",
        links: [
          {
            url: "https://github.com/biosimulations/biosimulations?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
    ],
  },
  {
    name: "Cyber-BioSecurity", //! CYBER-BIOSECURITY
    description: "Human-Body Communication, Biometric Authentication",
    image: img10,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    uf_research_professors: [
      {
        name: "Dr. Chatterjee (ECE)",
        linkedin: "https://www.linkedin.com/in/baibhabchatterjee/",
        lab: "https://chatterjee.ece.ufl.edu/",
      },
      {
        name: "Dr. Swarup Bhunia (ECE)",
        linkedin: "https://www.linkedin.com/in/swarup-bhunia-1281825/",
        lab: "https://swarup.ece.ufl.edu/",
      },
    ],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: ["Ixana"],
    skills: ["N/A"],
    classes: ["CIS4930 - Special Topics in CISE: Adversarial Cyber Tradecraft"],
    projectIdeas: [
      {
        text: "Develop a secure access-control protocol for implantable medical devices (IMDs) that uses hardware roots of trust and emergency override features.",
        links: [
          {
            url: "https://arxiv.org/abs/1803.09890?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Build a machine-learning based intrusion detection framework for smart healthcare systems (wearables + networked devices) that flags anomalous device behaviour.",
        links: [
          {
            url: "https://arxiv.org/abs/1909.10565?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Create a lifecycle-management workflow for medical device cybersecurity (risk modelling, threat modelling, SBOM, incident response) for hospital/clinical environments.",
        links: [
          {
            url: "https://health-isac.org/wp-content/uploads/IHE_MDSISC-Lifecycle-Management-Working-Group-Whitepaper-1.pdf?utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
      {
        text: "Implement a secure telemetry and firmware update architecture for network-connected medical devices, incorporating threat modelling and best-practice defenses.",
        links: [
          {
            url: "https://innolitics.com/articles/medical-device-cybersecurity-best-practices-faqs-and-examples/?utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
    ],
  },
  {
    name: "Nano & Microtech", //! NANO & MICROTECH
    description: "Bio-MEMS, Lab-on-a-Chip, Biological VLSI",
    image: img11,
    sectionsInColumn: [
      { section: "uf_research_professors", marginBottom: 6 },
      { section: "external_professors", marginBottom: 6 },
      { section: "companies", marginBottom: 6 },
      { section: "skills", marginBottom: 0 },
    ],
    uf_research_professors: [
      {
        name: "Dr. Hugh Fan (MAE)",
        linkedin: "https://www.linkedin.com/in/hughfan/",
        lab: "https://web.mae.ufl.edu/hfan/",
      },
      {
        name: "Dr. Domenic Forte (ECE)",
        linkedin: "https://www.linkedin.com/in/domenic-forte-13233153/",
        lab: "https://scannlab.psych.ufl.edu/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Rahul Sarpeshkar (Dartmouth)",
        linkedin:
          "https://engineering.dartmouth.edu/community/faculty/rahul-sarpeshkar",
        lab: "https://physics.dartmouth.edu/people/rahul-sarpeshkar",
      },
    ],
    companies: ["N/A"],
    skills: ["VLSI", "Digital Logic"],
    classes: [
      "EEE4420 - Introduction to Nanodevices",
      "EEL5934 - Special Topics in Electrical Engineering: Future of Micro/Nano Sys",
      "BME5580 - Introduction to Microfluidics and BioMEMS",
      "EEE5354L - Semiconductor Device Fabrication Laboratory",
      "EEE5405 - Microelectronic Fabrication Technologies",
      "EEE4329/5400 - Future of Microelectronics Technology",
    ],
    projectIdeas: [
      {
        text: "Develop a lab-on-a-chip microfluidic device (e.g., PDMS chip) for multiplexed cell sorting or small-volume diagnostics.",
        links: [
          {
            url: "https://github.com/AcubeSAT/microfluidics?utm_source=chatgpt.com",
            type: "github",
          },
        ],
      },
      {
        text: "Build a smartphone-controlled handheld microfluidic liquid-handling system for on-chip immunoassays or diagnostics.",
        links: [
          {
            url: "https://arxiv.org/abs/1405.5246?utm_source=chatgpt.com",
            type: "arxiv",
          },
        ],
      },
      {
        text: "Create an open-source microfluidic droplet detection & analysis setup: fabricate the chip + image acquisition + image processing pipeline for droplet experiments.",
        links: [
          {
            url: "https://www.nature.com/articles/s41598-024-65346-0?utm_source=chatgpt.com",
            type: "article",
          },
        ],
      },
      {
        text: "Design a Bio-MEMS device (microelectromechanical system) for biomedical sensing (e.g., pressure sensor, microfluidic valve array) with end-to-end documentation from design to fabrication to testing.",
        links: [
          {
            url: "https://bmedesign.engr.wisc.edu/projects/f23/photomask_aligner/file/view/cf4e7f54-3fb9-4e45-ad4f-d08f4ace5ee2/BioMems%20Final%20Report%20.pdf?utm_source=chatgpt.com",
            type: "documentation",
          },
        ],
      },
    ],
  },
];
