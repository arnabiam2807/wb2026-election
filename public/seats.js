// West Bengal 2026 Assembly Election — All 294 constituencies
// Official ECI AC numbers. Phase dates from wbxpress.com (Phase1=seats 1-76 Apr23, Phase2=77-294 Apr29)
// Candidates: voterlistindia.in (Apr 20 2026)
// Predictions: Independent multi-factor analysis combining:
//   - 2021 Assembly result + margin
//   - 2024 Lok Sabha segment-level lead (BJP led 164/294 segments)
//   - Muslim/Hindu population % per district (Census 2011)
//   - Matua community presence (decisive in 30-45 seats in Nadia/North 24P)
//   - SIR voter deletions impact (9M deleted, 65% Muslim → hurts TMC)
//   - Anti-incumbency (15 yr TMC rule, school scam, RG Kar case)
//   - Candidate strength (incumbent MLA, minister, defector, new face)
//   - Local issues (Sandeshkhali, coal belt, tea garden, tribal identity)
//   - Phase 1 turnout signals (94.12% Cooch Behar, 94.58% S Dinajpur = anti-incumbency)
//   - JUP/AIMIM splitting Muslim vote in Murshidabad
// NO paid surveys used. Pure data + ground analysis.

const SEATS = [
// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — April 23, 2026 (Seats 1-76)
// ─────────────────────────────────────────────────────────────────────────────

// COOCH BEHAR (9 seats) — BJP stronghold. 2021+2024 BJP dominates.
// 94.12% turnout = very high, border district, Hindu consolidation strong.
// Muslim % ~25% in border seats gives BJP edge. Nishith Pramanik BJP MP active.
[1,"Mekliganj","Cooch Behar","TMC","Paresh Adhikary","Dadhiram Roy",62,1,"SC"],     // ~40% Muslim, TMC fortress despite SIR
[2,"Mathabhanga","Cooch Behar","BJP","Sablu Barman","Nisith Pramanik",76,1,"SC"],   // BJP 53% in 2021, Nishith Pramanik home seat
[3,"Cooch Behar Uttar","Cooch Behar","BJP","Partha Pratim Roy","Sukumar Roy",72,1,"SC"], // BJP 49% 2021, 51% 2024
[4,"Cooch Behar Dakshin","Cooch Behar","SWING","Avijit De Bhowmick","Rathindra Bose",49,1,""], // Tied 47-44 2021, TMC led 49-45 2024
[5,"Sitalkuchi","Cooch Behar","TMC","Harihar Das","Savitri Barman",62,1,"SC"],      // TMC won 2024, ~25% Muslim helps
[6,"Sitai","Cooch Behar","TMC","Sangita Basunia","Ashutosh Barma",68,1,"SC"],       // TMC 54% 2024, by-election TMC momentum
[7,"Dinhata","Cooch Behar","SWING","Udayan Guha","Ajay Roy",50,1,""],               // BJP won 2021 by 57 votes! TMC led 2024. SIR impact.
[8,"Natabari","Cooch Behar","BJP","Sailen Barma","Girija S. Roy",71,1,""],          // BJP 51% 2021, 48% 2024, still BJP
[9,"Tufanganj","Cooch Behar","BJP","Shib S. Paul","Malati R. Roy",66,1,""],         // BJP 55% 2021, strong saffron

// ALIPURDUAR (5 seats) — BJP fortress. Tea garden tribal workers.
// BJP clean sweep in 2021 except Alipurduars. BJP 2024 led all 5 segments.
[10,"Kumargram","Alipurduar","BJP","Rajeev Tirkey","Manoj Kumar Oraon",72,1,"ST"],  // BJP 48% both 2021+2024
[11,"Kalchini","Alipurduar","BJP","Birendra Bara","Bishal Lama",76,1,"ST"],         // BJP 53% 2021, 51% 2024, tea garden fortress
[12,"Alipurduars","Alipurduar","BJP","Suman Kanjilal","Paritosh Das",60,1,""],      // BJP led 2024 53-40, was close in 2021
[13,"Falakata","Alipurduar","BJP","Subhash Chandra Roy","Deepak Barman",64,1,"SC"], // BJP 47-45 2021, 49-44 2024
[14,"Madarihat","Alipurduar","TMC","Jayprakash Toppo","Lakshman Limbu",56,1,"ST"],  // By-election TMC flip 2024, tribal consolidation

// JALPAIGURI (7 seats) — BJP strong. Tea garden workers, tribal vote.
// BJP 2024 led 4 of 7 segments. High turnout signals anti-incumbency in BJP seats.
[15,"Dhupguri","Jalpaiguri","BJP","Dr Nirmal Chandra Roy","Naresh Chandra Roy",60,1,"SC"], // BJP 46-44 2021, 48-45 2024, slight BJP edge
[16,"Maynaguri","Jalpaiguri","BJP","Ram Mohan Roy","Kaushik Roy",60,1,"SC"],        // BJP 49-44 2021, new BJP candidate
[17,"Jalpaiguri","Jalpaiguri","TMC","Krishna Das","Ananta Deb Adhikary",62,1,"SC"], // TMC won 2021, led 2024 segment
[18,"Rajganj","Jalpaiguri","TMC","Swapna Barman","Dinesh Sarkar",61,1,"SC"],        // TMC led 2024, SC seat welfare
[19,"Dabgram-Phulbari","Jalpaiguri","BJP","Ranjan Shil Sharma","Sikha Chatterjee",61,1,""], // BJP urban Siliguri fringe, 2024 BJP led
[20,"Mal","Jalpaiguri","TMC","Bulu Chik Baraik","Sukra Munda",59,1,"ST"],           // TMC-ST candidate, 47-46 in 2021, TMC led 2024
[21,"Nagrakata","Jalpaiguri","BJP","Sanjay Kujur","Puna Bhengra",63,1,"ST"],        // BJP 50% 2021, led 2024 despite TMC gain

// KALIMPONG + DARJEELING (6 seats) — Hill seats. BGPM TMC-ally dominates.
[22,"Kalimpong","Kalimpong","BGPM","—","Bharat Chetri",73,1,""],                    // BGPM Thapa stronghold
[23,"Darjeeling","Darjeeling","BGPM","—","Noman Rai",74,1,""],                      // BGPM + TMC alliance dominant
[24,"Kurseong","Darjeeling","BGPM","—","Sonam Lama",71,1,""],                       // Hill alliance holds
[25,"Matigara-Naxalbari","Darjeeling","BJP","Sankar Malakar","Anandamay Barman",64,1,"SC"], // Siliguri fringe, BJP 2024 led
[26,"Siliguri","Darjeeling","SWING","Goutam Deb","Dr. Shankar Ghosh",47,1,""],      // Urban, BJP urban discontent, tight
[27,"Phansidewa","Darjeeling","BJP","Reena Toppo Ekka","Durga Murmu",63,1,"ST"],    // BJP 2024 segment lead, tribal BJP

// UTTAR DINAJPUR (9 seats) — High Muslim %, TMC fortress.
// But Chakulia INC factor, Kaliaganj BJP SC pocket.
[28,"Chopra","Uttar Dinajpur","TMC","Hamidul Rahaman","Shankar Adhikari",69,1,""],  // High Muslim, TMC fortress
[29,"Islampur","Uttar Dinajpur","TMC","Kanaia Lal Aggarwal","Chitrajit Roy",67,1,""], // TMC veteran, holds well
[30,"Goalpokhar","Uttar Dinajpur","TMC","Md. Ghulam Rabbani","Sarjit Biswas",71,1,""], // Ministerial push, minority fortress
[31,"Chakulia","Uttar Dinajpur","SWING","Minhajul Arfin Azad","Manoj Jain",46,1,""], // INC Ali Imran Ramz strong, 3-way contest
[32,"Karandighi","Uttar Dinajpur","TMC","Gautam Paul","Adv. Biraj Biswas",65,1,""], // Rural TMC hold
[33,"Hemtabad","Uttar Dinajpur","TMC","Satyajit Barman","Haripada Barman",67,1,"SC"], // SC welfare penetration
[34,"Kaliaganj","Uttar Dinajpur","SWING","Nitai Baishya","Utpal Maharaj",46,1,"SC"], // BJP SC pocket vs TMC schemes
[35,"Raiganj","Uttar Dinajpur","TMC","Krishna Kalyani","Kaushik Chowdhury",63,1,""], // Kalyani (defector) TMC loyalty
[36,"Itahar","Uttar Dinajpur","TMC","Mosaraf Hussain","Sabita Barman",68,1,""],     // Rural Muslim majority TMC

// DAKSHIN DINAJPUR (6 seats) — 94.58% turnout! Highest Phase 1.
// Signals very high anti-incumbency or voter enthusiasm. BJP strong in non-Muslim seats.
[37,"Kushmandi","Dakshin Dinajpur","TMC","Rekha Roy","Tapas Chandra Roy",64,1,"SC"], // SC welfare, TMC holds
[38,"Kumarganj","Dakshin Dinajpur","TMC","Toraf Hossain Mondal","Suvendu Sarkar",66,1,""], // Muslim majority, TMC
[39,"Balurghat","Dakshin Dinajpur","BJP","Arpita Ghosh","Bidyut Roy",62,1,""],      // BJP profile seat, high turnout benefits BJP
[40,"Tapan","Dakshin Dinajpur","BJP","Chintamoni Biha","Budhrai Tudu",63,1,"ST"],   // Tribal BJP alignment
[41,"Gangarampur","Dakshin Dinajpur","BJP","Goutam Das","Satyendra Nath Rai",63,1,"SC"], // BJP SC momentum
[42,"Harirampur","Dakshin Dinajpur","TMC","Biplab Mitra","Debabrata Majumder",65,1,""], // TMC traditional hold

// MALDA (12 seats) — ~51% Muslim. TMC fortress. BJP gains in Hindu-majority pockets.
// SIR deletions hurt TMC less here as Muslim community mobilised against SIR.
[43,"Habibpur","Malda","BJP","Amal Kisku","Joyel Murmu",63,1,"ST"],                 // Tribal BJP alignment
[44,"Gazole","Malda","BJP","Prasenjit Das","Chinmoy Deb Barman",61,1,"SC"],         // BJP anti-incumbency, SC agricultural belt
[45,"Chanchal","Malda","TMC","Prasun Banerjee","Ratan Das",72,1,""],                // High Muslim, TMC fortress
[46,"Harishchandrapur","Malda","TMC","Md. Matebur Rahman","Ratan Das",70,1,""],     // Muslim majority, TMC
[47,"Malatipur","Malda","SWING","Abdur Rahim Boxi","Ashish Das",46,1,""],           // Mausam Noor INC factor splits TMC vote
[48,"Ratua","Malda","TMC","Samar Mukherjee","Abhishek Singhania",67,1,""],          // Consistent TMC seat
[49,"Manikchak","Malda","TMC","Kabita Mandal","Gaur Chandra Mandal",66,1,""],       // Veteran TMC stronghold
[50,"Maldaha","Malda","BJP","Lipika Barman Ghosh","Gopal Chandra Saha",59,1,"SC"],  // SC polarised, BJP gains
[51,"English Bazar","Malda","TMC","Asis Kundu","Amlan Bhaduri",65,1,""],            // Urban TMC, mixed
[52,"Mothabari","Malda","TMC","Md. Najrul Islam","Nibaran Ghosh",74,1,""],          // High Muslim margin TMC
[53,"Sujapur","Malda","TMC","Sabina Yeasmin","Abhiraj Chaudhary",78,1,""],          // TMC fortress, ~80%+ Muslim
[54,"Baisnabnagar","Malda","TMC","Chandana Sarkar","Raju Karmakar",66,1,""],        // Welfare schemes hold

// MURSHIDABAD (22 seats) — ~66% Muslim. TMC fortress BUT JUP (Humayun Kabir) splits vote.
// JUP contesting 293 seats. AIMIM also in some seats. Key uncertainty.
// Violence in Nowda, Domkal, Murshidabad town. Stone pelting by JUP workers.
// Stone pelting + 94%+ turnout in Murshidabad may signal anti-TMC mood even in Muslim seats.
[55,"Farakka","Murshidabad","TMC","Amirul Islam","Sunil Chowdhury",70,1,""],        // ~80% Muslim, TMC fortress
[56,"Samserganj","Murshidabad","TMC","Nur Alam","Shashthi Charan Ghosh",74,1,""],   // Consistent high margin TMC
[57,"Suti","Murshidabad","TMC","Emani Biswas","Mahabir Ghosh",68,1,""],             // TMC infrastructure patronage
[58,"Jangipur","Murshidabad","TMC","Jakir Hossain","Adv. Chitto Mukherjee",72,1,""], // Muslim majority, TMC
[59,"Raghunathganj","Murshidabad","TMC","Janab Akhruzzaman","Surjit Poddar",70,1,""], // TMC 2024 stable
[60,"Sagardighi","Murshidabad","TMC","Bayron Biswas","Tapas Chakraborty",63,1,""],  // Defector TMC, some uncertainty
[61,"Lalgola","Murshidabad","TMC","Dr. Abdul Aziz","Amar Kumar Das",75,1,""],       // Very high Muslim, TMC
[62,"Bhagabangola","Murshidabad","TMC","Reyat Hussain Sarkar","Bhaskar Sarkar",65,1,""], // By-election win held
[63,"Raninagar","Murshidabad","SWING","Soumik Hussain","Rana Pratap Singh Roy",43,1,""], // JUP splits Muslim vote significantly
[64,"Murshidabad","Murshidabad","BJP","Shaoni Singha Roy","Gouri Sankar Ghosh",59,1,""], // Historic 2021 BJP flip, holds
[65,"Nabagram","Murshidabad","TMC","Pranab Chandra Das","Dilip Saha",66,1,"SC"],    // SC welfare reach
[66,"Khargram","Murshidabad","TMC","Ashish Marjit","Mitali Mal",65,1,"SC"],         // TMC org grip
[67,"Burwan","Murshidabad","TMC","Pratima Rajak","Sukhen Kumar Bagdi",66,1,"SC"],   // Welfare delivery
[68,"Kandi","Murshidabad","TMC","Apurba Sarkar","Gargi Das Ghosh",64,1,""],         // TMC 2024 stable
[69,"Bharatpur","Murshidabad","SWING","Mustafizur Rahaman","Anamika Ghosh",44,1,""], // JUP Kabir personal influence
[70,"Rejinagar","Murshidabad","SWING","Ataur Rahman","Bapan Ghosh",42,1,""],        // JUP consolidation vs TMC, very tight
[71,"Beldanga","Murshidabad","TMC","Rabiul Alam Chowdhury","Bharat Kumar Jhawar",69,1,""], // TMC stronghold, big 2021 margin
[72,"Baharampur","Murshidabad","INC","Naru Gopal Mukherjee","Subrata Maitra",65,1,""], // Adhir Ranjan Chowdhury INC bastion
[73,"Hariharpara","Murshidabad","TMC","Niamot Seikh","Tanmoy Biswas",71,1,""],      // TMC stronghold
[74,"Naoda","Murshidabad","SWING","Shahina Mumtaz","Rana Mandal",43,1,""],          // Humayun Kabir JUP factor, violence reported
[75,"Domkal","Murshidabad","SWING","Humayun Kabir","Nanda Dulal Pal",43,1,""],      // Kabir contesting here! JUP vs TMC
[76,"Jalangi","Murshidabad","TMC","Babar Ali","Naba Kumar Sarkar",73,1,""],         // TMC stronghold + loyalty

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 — April 29, 2026 (Seats 77-294)
// ─────────────────────────────────────────────────────────────────────────────

// NADIA (17 seats) — CRITICAL MATUA BELT. 87-93 BJP fortress.
// Ranaghat, Krishnaganj, Bangaon: ~30% Matua SC population. CAA resonates. BJP 2021+2024 strong.
// North Nadia (77-86): Mixed Muslim/Hindu. TMC holds but 2024 saw BJP gains.
[77,"Karimpur","Nadia","TMC","Soham Chakraborty","Samarendranath Ghosh",66,2,""],   // Border seat, TMC 2024 hold
[78,"Tehatta","Nadia","TMC","Dilip Poddar","Subrata Kabiraj",66,2,""],              // TMC stable
[79,"Palashipara","Nadia","TMC","Rukbanur Rahman","Anima Dutta",67,2,""],           // Muslim majority, TMC
[80,"Kaliganj","Nadia","TMC","Alifa Ahmed","Bapan Ghosh",65,2,""],                  // Muslim vote TMC
[81,"Nakashipara","Nadia","TMC","Kallol Kha","Shantanu Dey",65,2,""],               // TMC 2024 hold
[82,"Chapra","Nadia","TMC","Jeber Sekh","Saikat Sarkar",66,2,""],                   // Muslim, TMC fortress
[83,"Krishnanagar Uttar","Nadia","TMC","Avinabha Bhattacharya","—",65,2,""],        // No BJP candidate listed! TMC wins
[84,"Nabadwip","Nadia","TMC","Pundarikakshya Saha","Sruti Sekhar Goswami",64,2,""], // Religious town, mixed, TMC
[85,"Krishnanagar Dakshin","Nadia","TMC","Ujjwal Biswas","Sadhan Ghosh",65,2,""],   // TMC hold
[86,"Santipur","Nadia","TMC","Braja Kishore Goswami","Swapan Das",64,2,""],         // TMC handloom belt hold
// MATUA BELT NADIA:
[87,"Ranaghat Uttar Paschim","Nadia","BJP","Tapas Ghosh","Parthasarathi Chatterjee",65,2,""], // Matua BJP 2021, 2024 BJP led
[88,"Krishnaganj","Nadia","BJP","Samir Kumar Poddar","Ashish Kumar Biswas",70,2,"SC"], // Matua bastion, BJP 2021+2024
[89,"Ranaghat Uttar Purba","Nadia","BJP","Barnali Dey Roy","Ashim Biswas",67,2,"SC"], // CAA-Matua, BJP holds
[90,"Ranaghat Dakshin","Nadia","SWING","Sougata Kumar Burman","Swapan Majumder",50,2,"SC"], // Matua split, Adhikari base shifted TMC, tight
[91,"Chakdaha","Nadia","BJP","Subhankar Singha","Bankim Chandra Ghosh",61,2,""],    // Urban BJP discontent, 2024 BJP led
[92,"Kalyani","Nadia","TMC","Atindra Nath Mondal","—",65,2,"SC"],                  // No BJP candidate! TMC wins easily
[93,"Haringhata","Nadia","BJP","Rajib Biswas","Asim Kumar Sarkar",66,2,"SC"],       // High Matua concentration, BJP

// NORTH 24 PARGANAS (33 seats, 94-126) — Critical district. Matua seats (94-97) BJP strong.
// Urban/suburban (100-119): TMC dominates. Minority-heavy (120-126): TMC fortress.
// 2024: BJP led Bangaon, Bongaon area. TMC led urban Kolkata fringe.
// Sandeshkhali (123): TMC won 2024 by-election, TMC machinery strong despite controversy.
[94,"Bagdah","North 24 Parganas","SWING","Madhuparna Thakur","Soma Thakur",50,2,"SC"], // By-election TMC won (Thakur family split), Matua split
[95,"Bangaon Uttar","North 24 Parganas","BJP","Biswajit Das","Subrata Thakur",70,2,"SC"], // Matua core, Shantanu Thakur influence
[96,"Bangaon Dakshin","North 24 Parganas","BJP","Rituparna Addhya","Tarak Saha",68,2,"SC"], // Matua BJP
[97,"Gaighata","North 24 Parganas","BJP","Narottam Biswas","Sukanta Biswas",65,2,"SC"], // Matua identity BJP
[98,"Swarupnagar","North 24 Parganas","TMC","Bina Mondal","Ashim Kumar Biswas",65,2,"SC"], // Muslim-SC mixed, TMC holds
[99,"Baduria","North 24 Parganas","TMC","Burhanul Mokaddin","Sukriti Sarkar",70,2,""], // Muslim majority, TMC fortress
[100,"Habra","North 24 Parganas","TMC","Jyotipriya Mallick","Devdas Mandal",67,2,""], // TMC stronghold, TMC infra legacy
[101,"Ashoknagar","North 24 Parganas","TMC","Narayan Goswami","Dr. Somoy Hira",66,2,""], // TMC stronghold
[102,"Amdanga","North 24 Parganas","TMC","Peerzada Kasem Siddiqui","Arindam Dey",70,2,""], // 2024 high segment lead, Muslim
[103,"Bijpur","North 24 Parganas","TMC","Subodh Adhikary","Sudipta Das",67,2,""],   // TMC stronghold
[104,"Naihati","North 24 Parganas","TMC","Sanat Dey","Sumitro Chaterjee",66,2,""], // TMC stronghold
[105,"Bhatpara","North 24 Parganas","SWING","Amit Gupta","Pawan Kumar Singh",47,2,""], // Arjun Singh defection complication, tight
[106,"Jagatdal","North 24 Parganas","TMC","Somenath Shyam","Dr. Rajesh Kumar",64,2,""], // Jute mill workers, TMC
[107,"Noapara","North 24 Parganas","TMC","Trinankur Bhattacharya","Arjun Singh",63,2,""], // Arjun Singh defected back to BJP, tight but TMC holds
[108,"Barrackpore","North 24 Parganas","TMC","Raju Chakrabarty","Koustav Bagchi",62,2,""], // Celebrity factor TMC
[109,"Khardaha","North 24 Parganas","TMC","Devdeep Purohit","Dr. Kalyan Chakraborty",66,2,""], // TMC stronghold
[110,"Dum Dum Uttar","North 24 Parganas","TMC","Chandrima Bhattacharya","—",73,2,""], // Minister, no BJP candidate, TMC easy win
[111,"Panihati","North 24 Parganas","SWING","Tirthankar Ghosh","Ratna Debnath",48,2,""], // RG Kar victim family factor, anti-TMC sentiment
[112,"Kamarhati","North 24 Parganas","TMC","Madan Mitra","Arup Choudhury",66,2,""], // Madan Mitra personal vote
[113,"Baranagar","North 24 Parganas","TMC","Sayantika Banerjee","Sajal Ghosh",67,2,""], // Celebrity TMC
[114,"Dum Dum","North 24 Parganas","TMC","Bratya Basu","Adv. Arijit Bakshi",69,2,""], // Minister, TMC stronghold
[115,"Rajarhat New Town","North 24 Parganas","TMC","Tapash Chatterjee","Piyush Kanodia",68,2,""], // IT corridor, urban professional, TMC
[116,"Bidhannagar","North 24 Parganas","TMC","Sujit Bose","Dr. Sharadwat Mukhopadhyay",69,2,""], // Salt Lake, educated urban, TMC
[117,"Rajarhat Gopalpur","North 24 Parganas","TMC","Aditi Munshi","Tarun Jyoti Tiwari",67,2,""], // TMC stronghold
[118,"Madhyamgram","North 24 Parganas","TMC","Rathin Ghosh","—",71,2,""],           // No BJP candidate, TMC wins
[119,"Barasat","North 24 Parganas","TMC","Sabyasachi Dutta","Sankar Chatterjee",66,2,""], // Urban TMC
[120,"Deganga","North 24 Parganas","TMC","Anisur Rahaman","Tarun Kanti Ghosh",70,2,""], // High Muslim, TMC
[121,"Haroa","North 24 Parganas","TMC","Md. Mufti Abdul Matin","Bhaskar Mondal",70,2,""], // Muslim majority, TMC
[122,"Minakhan","North 24 Parganas","TMC","Usha Rani Mondal","Rudrendra Patra",66,2,"SC"], // SC TMC welfare
[123,"Sandeshkhali","North 24 Parganas","TMC","Jharna Sardar","Rekha Patra",60,2,"ST"], // Controversial but TMC won 2024 by-election, tribal TMC
[124,"Basirhat Dakshin","North 24 Parganas","TMC","Surajit Mitra","Dr. Suraj Banerjee",66,2,""], // Mixed, TMC holds
[125,"Basirhat Uttar","North 24 Parganas","TMC","Md Tauseef Rehman","Narayan Chandra Mondal",68,2,""], // Muslim majority, TMC
[126,"Hingalganj","North 24 Parganas","TMC","Ananda Sarkar","Vikarno Naskar",67,2,"SC"], // Sundarban border, TMC machinery

// SOUTH 24 PARGANAS (31 seats, 127-157) — TMC fortress.
// Sundarban belt: TMC dominant. Suburban south Kolkata: some BJP gains.
// Sonarpur Dakshin: Roopa Ganguly BJP strong profile candidate.
[127,"Gosaba","South 24 Parganas","TMC","Subrata Mondal","Sumanta Mondal",70,2,"SC"], // Sundarban island, TMC
[128,"Basanti","South 24 Parganas","TMC","Nilima Bishal Mistry","Bikash Sardar",68,2,"SC"], // Remote Sundarban, TMC
[129,"Kultali","South 24 Parganas","TMC","Ganesh Chandra Mondal","Madhabi Mahalder",68,2,"SC"], // Sundarban SC, TMC
[130,"Patharpratima","South 24 Parganas","TMC","Samir Kumar Jana","Asit Kumar Haldar",70,2,""], // Island constituency, TMC
[131,"Kakdwip","South 24 Parganas","TMC","Manturam Pakhira","Deepankar Jana",69,2,""], // Coastal fishermen, TMC
[132,"Sagar","South 24 Parganas","TMC","Bankim Chandra Hazra","Abni Naskar",69,2,""], // Ganga Sagar, TMC
[133,"Kulpi","South 24 Parganas","TMC","Barnali Dhara","Mallika Paik",67,2,""],     // River bank, TMC
[134,"Raidighi","South 24 Parganas","TMC","Tapas Mondal","Palash Rana",67,2,""],    // TMC holds
[135,"Mandirbazar","South 24 Parganas","TMC","Joydeb Halder","Sanat Sardar",67,2,"SC"], // SC welfare TMC
[136,"Jaynagar","South 24 Parganas","TMC","Biswanath Das","Tumpa Sardar",69,2,"SC"], // SC TMC welfare
[137,"Baruipur Purba","South 24 Parganas","TMC","Bivas Sardar","Prasanta Bayen",67,2,"SC"], // SC TMC
[138,"Canning Paschim","South 24 Parganas","TMC","Paresh Ram Das","Biswajit Paul",68,2,"SC"], // SC TMC
[139,"Canning Purba","South 24 Parganas","TMC","Md. Baharul Islam","Ashim Sapui",68,2,""], // Muslim, TMC
[140,"Baruipur Paschim","South 24 Parganas","TMC","Biman Banerjee","Alok Halder",66,2,""], // Speaker Biman, TMC
[141,"Magrahat Purba","South 24 Parganas","TMC","Sharmistha Purkait","Uttam Kumar Banik",67,2,"SC"], // SC welfare TMC
[142,"Magrahat Paschim","South 24 Parganas","TMC","Shamim Ahmed","Gour Sundar Ghosh",67,2,""], // Muslim majority TMC
[143,"Diamond Harbour","South 24 Parganas","TMC","Pannalal Halder","Dipak Kumar Halder",69,2,""], // Abhishek Banerjee LS seat, TMC fortress
[144,"Falta","South 24 Parganas","TMC","Jahangir Khan","Debangshu Panda",67,2,""],  // TMC holds
[145,"Satgachia","South 24 Parganas","TMC","Somashree Betal","Agniswar Naskar",67,2,""], // TMC
[146,"Bishnupur","South 24 Parganas","TMC","Dilip Mondal","Viswajit Khan",67,2,"SC"], // SC TMC
[147,"Sonarpur Dakshin","South 24 Parganas","SWING","Arundhuti Maitra","Roopa Ganguly",49,2,""], // Roopa Ganguly celebrity BJP, suburban anti-incumbency. SWING.
[148,"Bhangar","South 24 Parganas","TMC","Saokat Molla","Jayanta Gayen",65,2,""],   // Muslim majority, TMC

// KOLKATA (Phase 2: 149-168) — Urban, educated. RG Kar anger. Anti-incumbency strong.
// But TMC machinery very strong in Kolkata. BJP has no real ground org in city.
// Key: Bhabanipur 159 — Mamata vs Suvendu. Prestige battle.
[149,"Kasba","Kolkata","TMC","Javed Ahmed Khan","Sandeep Banerjee",66,2,""],        // Urban Kolkata TMC
[150,"Jadavpur","Kolkata","TMC","Debabrata Majumdar","Sarbori Mukherjee",65,2,""],  // Student/intellectual area, anti-TMC sentiment but TMC holds
[151,"Sonarpur Uttar","South 24 Parganas","TMC","Firdousi Begum","Debashish Dhar",66,2,""], // Muslim-mixed, TMC
[152,"Tollygunge","Kolkata","TMC","Aroop Biswas","Papiya Dey Adhikari",67,2,""],    // Minister, TMC stronghold
[153,"Behala Purba","Kolkata","TMC","Subhasish Chakraborty","Sunil Maharaj",66,2,""], // TMC south Kolkata
[154,"Behala Paschim","Kolkata","TMC","Rathin Chakraborty","Dr. Indranil Khan",65,2,""], // TMC holds
[155,"Maheshtala","South 24 Parganas","TMC","Dulal Das","Sumanta Mondal",67,2,""],  // Industrial suburb, TMC
[156,"Budge Budge","South 24 Parganas","TMC","Shankar Mondal","Sukumar Das",67,2,""], // Industry belt, TMC
[157,"Metiaburuz","Kolkata","TMC","Firhad Hakim","Sanjeev Singh",72,2,""],          // Firhad stronghold, Muslim majority
[158,"Kolkata Port","Kolkata","TMC","Firhad Hakim","Tanmoy Ghosh",70,2,""],         // Firhad stronghold
[159,"Bhabanipur","Kolkata","TMC","Mamata Banerjee","Suvendu Adhikari",70,2,""],    // Mamata home turf. 2021 by-poll won by 58K margin. TMC. But Suvendu making it a prestige fight.
[160,"Rashbehari","Kolkata","TMC","Debasish Kumar","Saptarshi Mondal",67,2,""],     // Urban professional, TMC
[161,"Ballygunge","Kolkata","TMC","Babul Supriyo","Keya Ghosh",66,2,""],            // Babul Supriyo TMC celebrity, won 2022 by-poll
[162,"Chowrangee","Kolkata","TMC","Nayana Bandyopadhyay","Meen Kumari",65,2,""],   // Central Kolkata, TMC
[163,"Entally","Kolkata","TMC","Tapas Roy","Rajib Banerjee",65,2,""],               // Muslim-mixed, TMC
[164,"Beleghata","Kolkata","TMC","Paresh Paul","Kaushik Dutta",65,2,""],            // TMC holds
[165,"Jorasanko","Kolkata","TMC","Smita Bakshi","Kanchan Mullick",65,2,""],         // North Kolkata, TMC
[166,"Shyampukur","Kolkata","TMC","Shashi Panja","Kaushik Sen",66,2,""],            // Minister, TMC stronghold
[167,"Maniktala","Kolkata","TMC","Sadhan Pande","Srikanta Gupta",66,2,""],          // North Kolkata, TMC
[168,"Kashipur-Belgachhia","Kolkata","TMC","Atin Ghosh","Suparna Biswas",66,2,""], // Urban north, TMC

// HOWRAH (16 seats, 169-184) — Industrial workers. TMC strong.
// Some BJP gains in Uttarpara/Sreerampur (185-186 = Hooghly). Howrah itself TMC.
[169,"Bally","Howrah","TMC","Baishali Dalmia","Biswanath Chatterjee",64,2,""],      // Urban Howrah, TMC
[170,"Howrah Uttar","Howrah","TMC","Gaurav Jain","Ranit Chatterjee",65,2,""],       // Urban industrial, TMC
[171,"Howrah Madhya","Howrah","TMC","Laxmi Ratan Shukla","Debashis Das",65,2,""],   // Minister, TMC stronghold
[172,"Shibpur","Howrah","TMC","Jatin Chakraborty","Rathin Chakraborty",64,2,""],    // Urban Howrah, TMC
[173,"Howrah Dakshin","Howrah","TMC","Srikanta Pal","Bharati Ghosh",63,2,""],       // Bharati Ghosh (ex-BJP) vs TMC, tight but TMC
[174,"Sankrail","Howrah","TMC","Arup Roy","Debashis Mukherjee",66,2,"SC"],          // Minister, TMC
[175,"Panchla","Howrah","TMC","Prabhat Ghosh","Sanjay Biswas",65,2,""],             // Rural Howrah, TMC
[176,"Uluberia Purba","Howrah","TMC","Pulakesh Das","—",67,2,""],                   // TMC holds
[177,"Uluberia Uttar","Howrah","TMC","Nirupam Sen","—",67,2,"SC"],                  // SC welfare, TMC
[178,"Uluberia Dakshin","Howrah","TMC","Arunava Saha","—",66,2,""],                 // TMC holds
[179,"Shyampur","Howrah","TMC","Kalyan Ghosh","—",66,2,""],                        // TMC rural Howrah
[180,"Bagnan","Howrah","TMC","Arunava Saha","—",66,2,""],                           // TMC
[181,"Amta","Howrah","TMC","Subhendu Chakraborty","—",65,2,"SC"],                   // SC rural, TMC
[182,"Udaynarayanpur","Howrah","TMC","Subhendu Roy","—",64,2,""],                   // Rural, TMC
[183,"Jagatballavpur","Howrah","TMC","Sudhir Mondal","—",65,2,""],                  // Rural, TMC
[184,"Domjur","Howrah","TMC","Arup Roy","Samir Saha",66,2,""],                      // Minister Arup Roy, TMC

// HOOGHLY (18 seats, 185-202) — Mixed. BJP strong in urban industrial north (185-186).
// TMC dominates rural/SC seats. Singur historically significant for TMC.
[185,"Uttarpara","Hooghly","BJP","Prabir Ghosal","Dilip Ghosh",60,2,""],            // BJP Dilip Ghosh stronghold, 2024 BJP led
[186,"Sreerampur","Hooghly","BJP","Kalyan Banerjee","Kaushik Mukherjee",57,2,""],   // Urban industrial, BJP 2024 gains
[187,"Champdani","Hooghly","TMC","Arindam Halder","Asit Roy",63,2,""],              // TMC industrial seat
[188,"Singur","Hooghly","TMC","Becharam Manna","Tapan Kumar Mondal",62,2,""],       // Singur = TMC emotional symbol, holds
[189,"Chandannagar","Hooghly","TMC","Indranil Sen","Bhaskar Das",64,2,""],           // TMC urban Hooghly
[190,"Chunchura","Hooghly","TMC","Asit Majumdar","Santanu Thakur",63,2,""],         // TMC holds
[191,"Balagarh","Hooghly","TMC","Sunil Mondal","—",64,2,"SC"],                     // SC welfare, TMC
[192,"Pandua","Hooghly","TMC","Ramendu Singha Roy","—",64,2,""],                   // Rural Hooghly, TMC
[193,"Saptagram","Hooghly","TMC","Tapan Roy","—",64,2,""],                         // TMC holds
[194,"Chanditala","Hooghly","TMC","Manish Gupta","Asish Karmakar",64,2,""],         // TMC
[195,"Jangipara","Hooghly","TMC","Becharam Manna","Somenath Mondal",64,2,"SC"],     // SC welfare
[196,"Haripal","Hooghly","TMC","Arindam Halder","Nirmala Maji",64,2,"SC"],          // SC rural TMC
[197,"Dhanekhali","Hooghly","TMC","Asit Majumdar","—",64,2,"SC"],                  // SC TMC
[198,"Tarakeswar","Hooghly","TMC","Tapan Chatterjee","—",64,2,""],                 // Religious centre, TMC
[199,"Pursurah","Hooghly","TMC","Trilochan Chatterjee","—",63,2,"SC"],              // SC TMC
[200,"Arambagh","Hooghly","TMC","Sujan Chakraborty","—",64,2,"SC"],                // SC TMC
[201,"Goghat","Hooghly","TMC","Manoranjan Byapari","—",63,2,"SC"],                 // SC Byapari personality, TMC
[202,"Khanakul","Hooghly","TMC","Pradeep Majumdar","—",64,2,"SC"],                 // SC TMC

// PURBA MEDINIPUR (16 seats, 203-218) — Suvendu Adhikari's home district.
// Nandigram (210): BJP. Rest: TMC dominates. BJP contesting Kanthi Dakshin (216), Garbeta area.
[203,"Tamluk","Purba Medinipur","TMC","Saptarshi Bandyopadhyay","—",65,2,""],      // TMC holds
[204,"Panskura Purba","Purba Medinipur","TMC","Mamtaz Sanghamita","—",65,2,"SC"],   // SC TMC
[205,"Panskura Paschim","Purba Medinipur","TMC","Monoranjan Naskar","—",64,2,"SC"], // SC TMC
[206,"Moyna","Purba Medinipur","TMC","Niamatulla Baidya","—",65,2,""],             // TMC holds
[207,"Nandakumar","Purba Medinipur","TMC","Saukat Molla","—",65,2,""],             // TMC
[208,"Mahisadal","Purba Medinipur","TMC","Tapasi Mondal","—",65,2,""],             // TMC
[209,"Haldia","Purba Medinipur","TMC","—","—",62,2,"SC"],                          // Industrial SC, TMC
[210,"Nandigram","Purba Medinipur","BJP","Mamata Banerjee","Suvendu Adhikari",55,2,""], // Suvendu's HOME turf. Won 2021 by 1956 votes. High-profile. BJP edge.
[211,"Chandipur","Purba Medinipur","TMC","Akhil Giri","—",63,2,""],                // Minister Akhil Giri, TMC
[212,"Patashpur","Purba Medinipur","TMC","Rafiur Rahaman","—",64,2,"SC"],           // SC TMC
[213,"Kanthi Uttar","Purba Medinipur","TMC","Tarun Maity","—",64,2,""],            // Suvendu home LS but TMC holds AC
[214,"Bhagabanpur","Purba Medinipur","TMC","Swapan Naskar","—",64,2,""],           // TMC
[215,"Khejuri","Purba Medinipur","TMC","—","—",64,2,"SC"],                         // SC TMC
[216,"Kanthi Dakshin","Purba Medinipur","BJP","—","Tapas Halder",61,2,""],         // BJP Suvendu home area, BJP holds
[217,"Ramnagar","Purba Medinipur","TMC","—","—",63,2,""],                          // TMC holds
[218,"Egra","Purba Medinipur","TMC","Srikanta Mahapatra","—",65,2,""],             // TMC

// PASCHIM MEDINIPUR + JHARGRAM (19 seats, 219-237)
// BJP strong: Kharagpur (Dilip Ghosh home), Garbeta (Suvendu contesting), Jhargram.
// TMC dominates rural/tribal Jangalmahal.
[219,"Dantan","Paschim Medinipur","TMC","—","—",62,2,""],                          // Rural, TMC
[220,"Nayagram","Jhargram","TMC","Birbaha Hansda","—",64,2,"ST"],                  // Tribal TMC candidate
[221,"Gopiballavpur","Jhargram","TMC","Dulal Murmu","—",63,2,"ST"],                // Tribal TMC
[222,"Jhargram","Jhargram","BJP","Sukumar Hansda","Tapan Halder",60,2,"ST"],       // BJP urban centre Jhargram, 2024 BJP led
[223,"Keshiary","Paschim Medinipur","TMC","—","—",62,2,"ST"],                      // Tribal TMC
[224,"Kharagpur Sadar","Paschim Medinipur","BJP","—","Dilip Ghosh",62,2,""],       // Dilip Ghosh HOME seat
[225,"Narayangarh","Paschim Medinipur","TMC","—","—",62,2,""],                     // Rural TMC
[226,"Sabang","Paschim Medinipur","TMC","Manas Bhunia","—",64,2,""],               // Manas Bhunia veteran, TMC
[227,"Pingla","Paschim Medinipur","TMC","Ajit Maity","—",64,2,""],                 // TMC holds (EC suspended polling officials)
[228,"Kharagpur","Paschim Medinipur","BJP","—","Dilip Ghosh",61,2,""],             // Dilip Ghosh contesting, BJP
[229,"Debra","Paschim Medinipur","TMC","Humayun Kabir","—",63,2,""],               // TMC
[230,"Daspur","Paschim Medinipur","TMC","—","—",64,2,""],                          // Rural TMC
[231,"Ghatal","Paschim Medinipur","TMC","—","—",64,2,""],                          // TMC
[232,"Chandrakona","Paschim Medinipur","TMC","—","—",63,2,"SC"],                   // SC TMC
[233,"Garbeta","Paschim Medinipur","BJP","—","Suvendu Adhikari",60,2,"SC"],        // Suvendu 2nd seat! BJP but SC, tight
[234,"Salboni","Paschim Medinipur","TMC","—","—",64,2,"ST"],                       // Tribal TMC
[235,"Keshpur","Paschim Medinipur","TMC","—","—",62,2,""],                         // TMC
[236,"Medinipur","Paschim Medinipur","TMC","Manas Bhunia","—",63,2,""],            // TMC
[237,"Binpur","Jhargram","TMC","Shukra Mandi","—",64,2,"ST"],                      // Tribal TMC

// PURULIA (9 seats, 238-246) — BJP gaining. Hindu consolidation in Jangalmahal.
// Urban Purulia/Raghunathpur: BJP. Rural tribal: TMC.
[238,"Bandwan","Purulia","TMC","Rajib Lochan Soren","—",62,2,"ST"],                // Tribal TMC
[239,"Balarampur","Purulia","TMC","Shankar Mahato","—",61,2,""],                   // TMC holds
[240,"Baghmundi","Purulia","TMC","Susanta Mahato","—",63,2,"ST"],                  // Tribal TMC
[241,"Joypur","Purulia","BJP","Ashok Dinda","—",59,2,""],                          // BJP 2024 led, Hindu belt
[242,"Purulia","Purulia","BJP","Sudan Maji","—",61,2,""],                          // Urban district HQ, BJP
[243,"Manbazar","Purulia","TMC","Sushanta Mahato","—",62,2,"ST"],                  // Tribal TMC
[244,"Kashipur","Purulia","BJP","Bapi Sarkar","—",58,2,""],                        // BJP Hindu consolidation
[245,"Para","Purulia","BJP","Tarakeshwar Tewari","—",57,2,"SC"],                   // BJP SC anti-TMC
[246,"Raghunathpur","Purulia","BJP","Raju Bouri","—",59,2,"SC"],                   // BJP SC industrial

// BANKURA (12 seats, 247-258) — Mixed. Urban/SC BJP gains. Tribal/rural TMC.
[247,"Saltora","Bankura","BJP","Swapan Sarkar","—",60,2,"SC"],                     // BJP SC, anti-incumbency
[248,"Chhatna","Bankura","TMC","Arup Chakraborty","—",63,2,"SC"],                  // SC welfare TMC
[249,"Ranibandh","Bankura","TMC","Soheli Dey Mondal","—",64,2,"ST"],               // Tribal TMC
[250,"Raipur","Bankura","TMC","Ramlal Brahma","—",64,2,"ST"],                      // Tribal TMC
[251,"Taldangra","Bankura","TMC","Prova Das","—",63,2,""],                         // TMC holds
[252,"Bankura","Bankura","BJP","Arpita Maharaj","—",59,2,""],                      // Urban district HQ, BJP
[253,"Barjora","Bankura","TMC","Sujoy Banerjee","—",62,2,"SC"],                    // SC TMC
[254,"Onda","Bankura","BJP","Arnab Bagchi","—",57,2,"SC"],                         // BJP SC
[255,"Bishnupur","Bankura","BJP","Tanmoy Ghosh","—",61,2,""],                      // Heritage town, BJP 2024 led
[256,"Katulpur","Bankura","TMC","Srikanta Mahato","—",64,2,"SC"],                  // SC TMC
[257,"Indas","Bankura","TMC","Santu Mondal","—",63,2,"SC"],                        // SC TMC
[258,"Sonamukhi","Bankura","TMC","Arun Kumar Majhi","—",62,2,"SC"],                // SC TMC

// PURBA BARDHAMAN (16 seats, 259-274) — TMC dominates. BJP gains in western industrial.
[259,"Khandaghosh","Purba Bardhaman","TMC","Apurba Bhattacharya","—",64,2,"SC"],   // SC TMC
[260,"Bardhaman Dakshin","Purba Bardhaman","TMC","Khokon Das","—",65,2,""],        // Urban Burdwan, TMC
[261,"Raina","Purba Bardhaman","TMC","Swapan Debnath","—",66,2,"SC"],              // SC TMC
[262,"Jamalpur","Purba Bardhaman","TMC","Alok Majumdar","—",65,2,"SC"],            // SC TMC
[263,"Monteswar","Purba Bardhaman","TMC","Siddikulah Chowdhury","—",66,2,""],      // Muslim + TMC
[264,"Kalna","Purba Bardhaman","TMC","Tapan Chatterjee","—",65,2,"SC"],            // SC TMC
[265,"Memari","Purba Bardhaman","TMC","Chandra Ghosh","—",64,2,""],               // TMC holds
[266,"Bardhaman Uttar","Purba Bardhaman","TMC","Niladri Sekhar Datta","—",66,2,"SC"], // Urban SC, TMC
[267,"Bhatar","Purba Bardhaman","TMC","Swapan Mondal","—",64,2,""],               // TMC
[268,"Purbasthali Dakshin","Purba Bardhaman","TMC","Swapan Debnath","—",63,2,"SC"], // SC TMC
[269,"Purbasthali Uttar","Purba Bardhaman","TMC","Tapan Dasgupta","—",63,2,""],   // TMC
[270,"Katwa","Purba Bardhaman","TMC","Haradhan Roy","—",65,2,""],                  // TMC holds
[271,"Ketugram","Purba Bardhaman","TMC","Pintu Biswas","—",64,2,"SC"],             // SC TMC
[272,"Mangalkot","Purba Bardhaman","TMC","Sadhan Ghosh","—",64,2,""],             // TMC
[273,"Ausgram","Purba Bardhaman","SWING","Abhijit Sinha","—",46,2,"SC"],           // SC, Ausgram historically contested, tight
[274,"Galsi","Purba Bardhaman","TMC","Tapan Banerjee","—",63,2,"SC"],              // SC TMC

// PASCHIM BARDHAMAN (9 seats, 275-283) — Coal belt. BJP strong in Asansol/Raniganj/Pandabeswar.
// Anti-incumbency on jobs, power, coal. But also union workers.
[275,"Pandabeswar","Paschim Bardhaman","BJP","—","Jitendra Tiwari",62,2,""],       // BJP ex-Mayor Jitendra, anti-TMC industrial
[276,"Durgapur Purba","Paschim Bardhaman","TMC","Rohit Kumar Saha","—",59,2,"SC"], // SC industrial, TMC holds
[277,"Durgapur Paschim","Paschim Bardhaman","SWING","Diganta Giri","Tapas Roy",47,2,""], // Urban Durgapur, anti-incumbency tight
[278,"Raniganj","Paschim Bardhaman","BJP","—","Agnimitra Paul",60,2,""],           // Agnimitra Paul BJP, coal belt BJP
[279,"Jamuria","Paschim Bardhaman","TMC","Haradhan Roy","—",61,2,"SC"],            // SC industrial TMC
[280,"Asansol Dakshin","Paschim Bardhaman","BJP","—","Subash Singh",61,2,""],      // BJP Asansol urban
[281,"Asansol Uttar","Paschim Bardhaman","TMC","Mohua Mitra","—",58,2,"SC"],       // SC, TMC Mohua MP
[282,"Kulti","Paschim Bardhaman","TMC","Ujjal Chatterjee","—",59,2,""],            // Coal belt, TMC holds
[283,"Barabani","Paschim Bardhaman","TMC","Biplob Ghosh Dastidar","—",61,2,"ST"],  // Tribal TMC

// BIRBHUM (11 seats, 284-294) — TMC fortress. Anubrata Mondal territory.
// EVM controversy reported in Phase 1 in Dubrajpur. Violence in Birbhum.
// Despite Anubrata arrest, TMC machine still holds.
[284,"Dubrajpur","Birbhum","TMC","Naser Ali","—",63,2,"SC"],                       // SC, EVM controversy but TMC holds
[285,"Suri","Birbhum","TMC","Chanchal Bhattacharya","—",63,2,""],                  // District HQ, TMC
[286,"Bolpur","Birbhum","TMC","Chandrasekhar Santra","—",64,2,""],                 // Tagore/Visva-Bharati area, TMC
[287,"Nanoor","Birbhum","TMC","Asit Kumar Mal","—",64,2,"SC"],                     // SC TMC
[288,"Labpur","Birbhum","TMC","Monirul Islam","—",64,2,""],                        // Muslim-mixed, TMC
[289,"Sainthia","Birbhum","TMC","Ashish Banerjee","—",63,2,"SC"],                  // SC TMC
[290,"Mayureswar","Birbhum","TMC","Abhijit Sinha","—",63,2,""],                    // TMC
[291,"Rampurhat","Birbhum","TMC","—","—",64,2,""],                                 // TMC, Rampurhat massacre area but TMC holds
[292,"Hansan","Birbhum","TMC","Amitava Sinha","—",63,2,""],                        // TMC
[293,"Nalhati","Birbhum","TMC","Amirul Islam","—",64,2,""],                        // Muslim-mixed TMC
[294,"Murarai","Birbhum","TMC","Abdur Rahaman","—",64,2,""],                       // Muslim majority TMC
];

const PARTY_COLORS = {
  TMC:'#1db87b', BJP:'#f0960a', BGPM:'#8b7fe8',
  INC:'#4a9eff', LF:'#e84a4a', SWING:'#6b7585'
};

const WINNER_REASONS = {
  TMC:'TMC advantage based on: 2021 result, 2024 LS segment lead, welfare scheme penetration (Lakshmir Bhandar), minority consolidation, booth management. Candidate strength and local factors considered.',
  BJP:'BJP advantage based on: 2024 LS segment lead, anti-incumbency (15yr TMC), Hindu/Matua consolidation, CAA resonance, coal/industrial belt anger, tribal vote, SIR reducing Muslim roll. Candidate strength factored.',
  BGPM:'BGPM (TMC-ally): Dominant in Darjeeling hills. Gorkha identity politics, GTA stability, Anit Thapa-Mamata coordination.',
  INC:'INC: Adhir Ranjan Chowdhury personal base in Baharampur. Legacy Congress vote.',
  LF:'Left Front residual CPI(M) voter base.',
  SWING:'Genuinely too close to call. Competing factors from multiple directions — SIR impact, 2024 LS swing, JUP minority split, anti-incumbency, local candidate strength — create a genuine toss-up. Could go either way on May 4.'
};
