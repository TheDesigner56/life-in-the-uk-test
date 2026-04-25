export interface ChapterSection {
  title: string;
  content: string[];
}

export interface KeyFact {
  question: string;
  answer: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface ChapterContent {
  id: number;
  title: string;
  shortName: string;
  color: string;
  description: string;
  sections: ChapterSection[];
  keyFacts: KeyFact[];
  flashcards: Flashcard[];
}

export const chapterContents: ChapterContent[] = [
  {
    id: 1,
    title: 'The Values and Principles of the UK',
    shortName: 'Values & Principles',
    color: '#EF4444',
    description: 'Learn about the fundamental values, principles, and responsibilities that form the foundation of British life.',
    sections: [
      {
        title: 'Fundamental Principles',
        content: [
          'The UK is a diverse and multicultural society built on a set of core values and principles. These include democracy, the rule of law, individual liberty, and mutual respect for and tolerance of those with different faiths and beliefs.',
          'Democracy means that the people of the UK choose their leaders through free and fair elections. Everyone over the age of 18 can vote in general elections and have their say in how the country is run.',
          'The rule of law means that nobody is above the law — everyone must follow the same laws, including the government, the police, and all citizens. This ensures fairness and protects people\'s rights.',
          'Individual liberty means that people in the UK have the freedom to make choices about how they live their lives, as long as they do not break the law or infringe on the rights of others.',
          'Freedom of speech is an important part of British life. People can express their opinions freely, including through the media and online, although there are laws to prevent hate speech, discrimination, and encouraging violence.'
        ]
      },
      {
        title: 'Responsibilities & Freedoms',
        content: [
          'Living in the UK comes with both rights and responsibilities. All citizens and residents are expected to obey the law, respect the rights of others, and contribute to their local communities.',
          'British citizens have the right to vote in elections, stand for public office, and serve on a jury. Serving on a jury is an important civic duty — juries are made up of ordinary people who decide whether someone accused of a serious crime is guilty or not guilty.',
          'The UK has a long tradition of protecting human rights. The Human Rights Act 1998 incorporates the European Convention on Human Rights into UK law. This protects fundamental rights including the right to life, the right to a fair trial, freedom from torture, and the right to respect for private and family life.',
          'Freedom of religion is protected in the UK. People are free to practise any religion they choose, or to choose not to follow any religion at all. Britain has a history of religious tolerance, and people of all faiths are protected by law from discrimination.',
          'The Equality Act 2010 protects people from discrimination based on protected characteristics: age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation.'
        ]
      },
      {
        title: 'Becoming a Citizen',
        content: [
          'To become a British citizen, you must pass the Life in the UK Test and meet certain residency requirements. Citizenship gives you the right to live in the UK permanently, vote in elections, and hold a British passport.',
          'British citizens are expected to respect the laws, values, and traditions of the UK. This includes respecting the rights of others, treating everyone fairly regardless of their background, and contributing to the community.',
          'Naturalisation is the process by which adults who were not born British can become British citizens. You must be at least 18 years old, have lived in the UK for at least 5 years (or 3 years if married to a British citizen), have held indefinite leave to remain for at least 12 months, and intend to continue living in the UK.',
          'Citizens also have responsibilities such as paying taxes, registering to vote, and potentially serving on a jury if called. Contributing to the community through volunteering or charitable work is also encouraged.'
        ]
      }
    ],
    keyFacts: [
      { question: 'What are the four fundamental values of the UK?', answer: 'Democracy, the rule of law, individual liberty, and mutual respect and tolerance.' },
      { question: 'What does the rule of law mean?', answer: 'Nobody is above the law — everyone must follow it.' },
      { question: 'What is the minimum voting age in UK general elections?', answer: '18 years old.' },
      { question: 'What year was the Human Rights Act passed?', answer: '1998.' },
      { question: 'Name five protected characteristics under the Equality Act 2010.', answer: 'Age, disability, gender reassignment, race, religion or belief, sex, sexual orientation, marriage/civil partnership, pregnancy/maternity.' },
      { question: 'What is the role of a jury?', answer: 'To listen to evidence and decide whether the defendant is guilty or not guilty.' },
      { question: 'How long must you have lived in the UK to apply for citizenship?', answer: 'At least 5 years (or 3 years if married to a British citizen).' },
      { question: 'What does freedom of religion mean in the UK?', answer: 'People can practise any religion they choose, or none at all.' }
    ],
    flashcards: [
      { id: 'ch1_f1', front: 'What does \u201cthe rule of law\u201d mean?', back: 'Nobody is above the law. Everyone, including the government, must follow the law.' },
      { id: 'ch1_f2', front: 'Name the four fundamental British values.', back: 'Democracy, the rule of law, individual liberty, and mutual respect and tolerance of those with different faiths and beliefs.' },
      { id: 'ch1_f3', front: 'What is the minimum age to vote in a UK general election?', back: '18 years old.' },
      { id: 'ch1_f4', front: 'When was the Human Rights Act passed?', back: '1998.' },
      { id: 'ch1_f5', front: 'What is a jury\u2019s purpose?', back: 'To listen to evidence and decide whether the defendant is guilty or not guilty.' },
      { id: 'ch1_f6', front: 'Name three protected characteristics under the Equality Act.', back: 'Age, disability, gender reassignment, race, religion or belief, sex, sexual orientation.' },
      { id: 'ch1_f7', front: 'What does individual liberty mean?', back: 'The right to make your own choices about your life as long as you don\u2019t break the law.' },
      { id: 'ch1_f8', front: 'How many years must you live in the UK to apply for citizenship?', back: '5 years (or 3 years if married to a British citizen).' },
      { id: 'ch1_f9', front: 'What does freedom of religion mean?', back: 'You can practise any religion, or choose not to follow any religion.' },
      { id: 'ch1_f10', front: 'What is the role of the police?', back: 'To enforce the law and protect the public.' }
    ]
  },
  {
    id: 2,
    title: 'What is the UK?',
    shortName: 'What is the UK?',
    color: '#3B82F6',
    description: 'Learn about the geography, countries, and identity of the United Kingdom.',
    sections: [
      {
        title: 'Countries of the UK',
        content: [
          'The United Kingdom is made up of four countries: England, Scotland, Wales, and Northern Ireland. The full name is the United Kingdom of Great Britain and Northern Ireland.',
          'Great Britain is the island containing England, Scotland, and Wales. The United Kingdom includes Northern Ireland as well. The British Isles refers to the group of islands that includes Great Britain, Ireland, and many smaller islands.',
          'England is the largest country by both area and population, with around 56 million people. Its capital is London. Scotland is in the north of Great Britain, with a population of about 5.5 million. Its capital is Edinburgh. Wales is to the west of England with about 3 million people; its capital is Cardiff. Northern Ireland is part of the island of Ireland with about 1.9 million people; its capital is Belfast.',
          'The UK has a population of approximately 67 million people. English is the official language, but Welsh is spoken in parts of Wales, Scots Gaelic in parts of Scotland, and Irish Gaelic in parts of Northern Ireland.',
          'The flag of the United Kingdom is called the Union Jack or Union Flag. It combines the crosses of three patron saints: St George (England), St Andrew (Scotland), and St Patrick (Ireland).'
        ]
      },
      {
        title: 'Crown Dependencies & Overseas Territories',
        content: [
          'The Crown dependencies are self-governing territories that belong to the British Crown but are not part of the UK. They include the Isle of Man and the Channel Islands (Jersey and Guernsey).',
          'The Crown dependencies have their own governments and are not represented in the UK Parliament. However, the UK is responsible for their defence and foreign affairs.',
          'The UK also has 14 Overseas Territories, including Bermuda, the Cayman Islands, Gibraltar, and the Falkland Islands. These are territories that were formerly part of the British Empire.'
        ]
      },
      {
        title: 'UK Geography',
        content: [
          'The UK has a temperate climate, meaning mild temperatures with rainfall spread throughout the year. It rarely gets extremely hot or extremely cold.',
          'The longest river in the UK is the River Severn (354 km), which forms part of the border between England and Wales. The highest mountain is Ben Nevis in Scotland, at 1,345 metres.',
          'Famous UK landmarks include Stonehenge (a prehistoric monument in Wiltshire), the Giant\'s Causeway (a natural rock formation in Northern Ireland), Hadrian\'s Wall (a Roman defensive wall across northern England), and the Tower of London (a historic castle and UNESCO World Heritage Site).',
          'The Lake District is a national park in England known for its mountains and lakes. Snowdonia is a national park in Wales, and the Cairngorms is a national park in Scotland.',
          'The currency of the UK is the Pound Sterling (GBP). Major cities include London, Birmingham, Manchester, Edinburgh, Glasgow, Cardiff, and Belfast.'
        ]
      },
      {
        title: 'National Identity',
        content: [
          'Each country of the UK has its own patron saint and national day. St George is the patron saint of England, celebrated on 23 April. St Andrew is the patron saint of Scotland, celebrated on 30 November. St David is the patron saint of Wales, celebrated on 1 March. St Patrick is the patron saint of Northern Ireland, celebrated on 17 March.',
          'The UK does not have a single official national anthem, but "God Save the King" (or "God Save the Queen" when the monarch is female) is traditionally used.',
          'Scotland has its own legal system, which is separate from the English legal system. Wales and Northern Ireland use variations of the English legal system.',
          'Each of the four countries has its own parliament or assembly (except England, which is governed directly by the UK Parliament): the Scottish Parliament at Holyrood, the Welsh Parliament (Senedd), and the Northern Ireland Assembly at Stormont.'
        ]
      }
    ],
    keyFacts: [
      { question: 'Name the four countries of the UK.', answer: 'England, Scotland, Wales, and Northern Ireland.' },
      { question: 'What is the capital of Scotland?', answer: 'Edinburgh.' },
      { question: 'What is the capital of Wales?', answer: 'Cardiff.' },
      { question: 'What is the capital of Northern Ireland?', answer: 'Belfast.' },
      { question: 'What is the population of the UK?', answer: 'Approximately 67 million.' },
      { question: 'What is the UK flag called?', answer: 'The Union Jack or Union Flag.' },
      { question: 'Name the Crown dependencies.', answer: 'The Isle of Man, Jersey, and Guernsey.' },
      { question: 'What is the longest river in the UK?', answer: 'The River Severn (354 km).' },
      { question: 'What is the highest mountain in the UK?', answer: 'Ben Nevis (1,345 metres).' },
      { question: 'What is the currency of the UK?', answer: 'The Pound Sterling (GBP).' }
    ],
    flashcards: [
      { id: 'ch2_f1', front: 'Name the four countries of the UK.', back: 'England, Scotland, Wales, and Northern Ireland.' },
      { id: 'ch2_f2', front: 'What is the capital of Scotland?', back: 'Edinburgh.' },
      { id: 'ch2_f3', front: 'What is the capital of Wales?', back: 'Cardiff.' },
      { id: 'ch2_f4', front: 'What is the capital of Northern Ireland?', back: 'Belfast.' },
      { id: 'ch2_f5', front: 'What is the UK flag called?', back: 'The Union Jack or Union Flag.' },
      { id: 'ch2_f6', front: 'What is the longest river in the UK?', back: 'The River Severn at 354 km.' },
      { id: 'ch2_f7', front: 'What is the highest mountain in the UK?', back: 'Ben Nevis in Scotland at 1,345 metres.' },
      { id: 'ch2_f8', front: 'What is the population of the UK?', back: 'Approximately 67 million.' },
      { id: 'ch2_f9', front: 'What is the currency of the UK?', back: 'The Pound Sterling (GBP).' },
      { id: 'ch2_f10', front: 'Name three Crown dependencies.', back: 'The Isle of Man, Jersey, and Guernsey.' }
    ]
  },
  {
    id: 3,
    title: 'A Long and Illustrious History',
    shortName: 'A Long History',
    color: '#F59E0B',
    description: 'Explore Britain\u2019s rich history from ancient times through to the modern era.',
    sections: [
      {
        title: 'Early Britain',
        content: [
          'The first people arrived in Britain around 10,000 years ago after the last Ice Age ended. These early inhabitants were hunter-gatherers who gradually settled into farming communities.',
          'Stonehenge, one of the most famous prehistoric monuments in the world, was built in Wiltshire, England around 5,000 years ago. It is believed to have been a religious or ceremonial site, possibly used for astronomical observations.',
          'The Bronze Age began around 4,000 years ago, bringing new metal-working skills. The Beaker people and other settlers arrived, burying their dead in round barrows.',
          'The Celts were tribes who lived in Britain, Ireland, and parts of Europe before the Roman invasion. Celtic languages can still be heard today in Scotland (Gaelic), Wales (Welsh), Northern Ireland (Irish), and Cornwall (Cornish).'
        ]
      },
      {
        title: 'The Romans & Anglo-Saxons',
        content: [
          'The Romans first invaded Britain in AD 43 under Emperor Claudius. They established towns, built roads, and introduced their legal system and culture. The Romans called London "Londinium".',
          'Emperor Hadrian built a wall across northern England around AD 122 to keep out the Picts from Scotland. Hadrian\'s Wall is still visible today.',
          'The Romans left Britain in AD 410 when the Roman army was recalled to defend Rome. Christianity had appeared in Roman Britain during this period.',
          'After the Romans left, Britain was invaded by Anglo-Saxons from Germany, Denmark, and the Netherlands. They spoke Old English (Anglo-Saxon), the earliest form of the English language.',
          'King Alfred the Great (849\u2013899) was an Anglo-Saxon king famous for fighting against Viking invasions and promoting learning and education. The Vikings established the Danelaw \u2014 an area of England under their control.'
        ]
      },
      {
        title: 'The Middle Ages',
        content: [
          'The Norman Conquest of 1066 was one of the most important events in British history. William the Conqueror, Duke of Normandy, defeated King Harold at the Battle of Hastings and became King of England.',
          'The Normans built castles throughout England, initially as motte-and-bailey structures, later replaced by stone castles. They also carried out the Domesday Book survey in 1086 to record land ownership for tax purposes.',
          'King Henry II (1154\u20131189) established a common legal system for England. His son, King John, was forced by the barons to agree to Magna Carta in 1215, which established the principle that the king was subject to the law.',
          'The Black Death arrived in England in 1348, killing about one-third of the population. This devastating plague changed society forever, leading to labour shortages and social upheaval.',
          'The Hundred Years\' War with France began in 1337. The English achieved notable victories at the Battles of Crecy (1346) and Agincourt (1415) under King Henry V.'
        ]
      },
      {
        title: 'The Tudor & Stuart Periods',
        content: [
          'The Tudor period began in 1485 when Henry VII defeated Richard III at the Battle of Bosworth Field. This ended the Wars of the Roses between the Houses of Lancaster and York.',
          'Henry VIII (1509\u20131547) is famous for having six wives and for breaking with the Roman Catholic Church. He established the Church of England (Anglican Church) and dissolved the monasteries.',
          'Henry VIII\'s daughter, Elizabeth I (1558\u20131603), known as the Virgin Queen, presided over a golden age. Sir Francis Drake helped defeat the Spanish Armada in 1588. William Shakespeare wrote his famous plays during this period.',
          'The Gunpowder Plot of 1605 was a failed attempt by Guy Fawkes to blow up the Houses of Parliament. This is commemorated every year on Bonfire Night (5 November).',
          'The English Civil War (1642\u20131651) was fought between the Crown (Royalists) and Parliament (Parliamentarians). King Charles I was executed in 1649, and Oliver Cromwell became Lord Protector of the Commonwealth until 1660.',
          'The Great Plague of 1665 killed about 100,000 people in London. The following year, the Great Fire of London destroyed much of the medieval city.'
        ]
      },
      {
        title: 'The 18th Century',
        content: [
          'The Glorious Revolution of 1688 was the peaceful overthrow of King James II. The Bill of Rights 1689 established the rights of Parliament and limits on the monarch\'s power.',
          'The Act of Union 1707 united the Kingdom of England and the Kingdom of Scotland into the Kingdom of Great Britain.',
          'The 18th century was the Age of Enlightenment \u2014 a period of intellectual development emphasising reason and science. Scottish inventors like James Watt improved the steam engine, which was crucial to the Industrial Revolution.',
          'Robert Burns (1759\u20131796) is Scotland\'s national poet, famous for "Auld Lang Syne".',
          'The slave trade involved buying, transporting, and selling enslaved people from Africa to the Americas. William Wilberforce led the campaign to abolish it. The slave trade was abolished throughout the British Empire in 1807, and slavery itself was abolished in 1833.'
        ]
      },
      {
        title: 'The 19th Century',
        content: [
          'The Victorian era (1837\u20131901) was the reign of Queen Victoria. Britain became the world\'s greatest power, with a vast empire covering a quarter of the world\'s land area.',
          'The Industrial Revolution transformed Britain from an agricultural society to an industrial one. Factories, railways, and cities grew rapidly. Living conditions for many workers were poor, leading to reforms.',
          'Isambard Kingdom Brunel (1806\u20131859) was a famous British engineer who built railways, bridges, and ships. Florence Nightingale (1820\u20131910) founded modern nursing.',
          'Ireland suffered the Great Famine (1845\u20131852), caused by potato blight, which led to mass emigration. Millions of Irish people left for Britain, the USA, and other countries.',
          'The Reform Act 1832 increased the number of men who could vote. The Suffragettes, led by Emmeline Pankhurst, campaigned for women\'s right to vote in the early 20th century.'
        ]
      },
      {
        title: 'The 20th Century',
        content: [
          'Britain fought in both World Wars. In World War I (1914\u20131918), millions of British soldiers died. After the war, the British Empire reached its greatest extent.',
          'The Easter Rising of 1916 in Dublin led to the Irish War of Independence. In 1922, southern Ireland became the Irish Free State, while Northern Ireland remained part of the UK.',
          'World War II began in 1939. Winston Churchill became Prime Minister in 1940 and led Britain through its "finest hour." The war ended in 1945.',
          'The Labour government elected in 1945 established the welfare state, including the National Health Service (NHS) in 1948. India, Pakistan, and many other colonies gained independence in the years following the war.',
          'The 1960s saw major social changes. Britain joined the European Economic Community (EEC) in 1973. Margaret Thatcher became Britain\'s first female Prime Minister in 1979.'
        ]
      },
      {
        title: 'Britain Since 1945',
        content: [
          'The UK has become a multicultural society, with immigration from former colonies and other countries enriching British culture. Foods, music, and traditions from around the world are now part of British life.',
          'The Good Friday Agreement in 1998 brought peace to Northern Ireland after decades of conflict known as "The Troubles."',
          'In 2016, the UK voted to leave the European Union in a referendum. Brexit was completed in 2020.',
          'The UK continues to play an important role in international organisations including NATO, the United Nations, and the Commonwealth.',
          'Britain has produced many world-leading scientists, inventors, writers, and musicians, contributing to global culture and knowledge.'
        ]
      }
    ],
    keyFacts: [
      { question: 'When did the Romans first invade Britain?', answer: 'AD 43 under Emperor Claudius.' },
      { question: 'When did the Romans leave Britain?', answer: 'AD 410.' },
      { question: 'When was the Battle of Hastings?', answer: '1066.' },
      { question: 'Who won the Battle of Hastings?', answer: 'William the Conqueror.' },
      { question: 'When was Magna Carta signed?', answer: '1215.' },
      { question: 'When did the Black Death arrive in England?', answer: '1348.' },
      { question: 'How many wives did Henry VIII have?', answer: 'Six.' },
      { question: 'Which church did Henry VIII establish?', answer: 'The Church of England (Anglican Church).' },
      { question: 'When did Elizabeth I become queen?', answer: '1558.' },
      { question: 'When was the Spanish Armada defeated?', answer: '1588.' },
      { question: 'What was the Gunpowder Plot?', answer: 'A failed attempt to blow up Parliament in 1605.' },
      { question: 'When was the Great Fire of London?', answer: '1666.' },
      { question: 'When did the Act of Union unite England and Scotland?', answer: '1707.' },
      { question: 'When was the slave trade abolished?', answer: '1807.' },
      { question: 'When did Queen Victoria become queen?', answer: '1837.' },
      { question: 'When was the NHS established?', answer: '1948.' },
      { question: 'Who was Prime Minister during WWII?', answer: 'Winston Churchill.' },
      { question: 'When was the Good Friday Agreement?', answer: '1998.' }
    ],
    flashcards: [
      { id: 'ch3_f1', front: 'When did the Romans first invade Britain?', back: 'AD 43 under Emperor Claudius.' },
      { id: 'ch3_f2', front: 'When did the Romans leave Britain?', back: 'AD 410.' },
      { id: 'ch3_f3', front: 'When was the Battle of Hastings?', back: '1066.' },
      { id: 'ch3_f4', front: 'Who became King after the Battle of Hastings?', back: 'William the Conqueror.' },
      { id: 'ch3_f5', front: 'When was Magna Carta signed?', back: '1215.' },
      { id: 'ch3_f6', front: 'When did the Black Death arrive?', back: '1348.' },
      { id: 'ch3_f7', front: 'How many wives did Henry VIII have?', back: 'Six.' },
      { id: 'ch3_f8', front: 'What church did Henry VIII establish?', back: 'The Church of England.' },
      { id: 'ch3_f9', front: 'When was the Spanish Armada defeated?', back: '1588.' },
      { id: 'ch3_f10', front: 'When was the Great Fire of London?', back: '1666.' },
      { id: 'ch3_f11', front: 'When did the Act of Union pass?', back: '1707.' },
      { id: 'ch3_f12', front: 'When was the slave trade abolished?', back: '1807.' },
      { id: 'ch3_f13', front: 'When did Queen Victoria become queen?', back: '1837.' },
      { id: 'ch3_f14', front: 'Who led Britain in WWII?', back: 'Winston Churchill.' },
      { id: 'ch3_f15', front: 'When was the NHS established?', back: '1948.' },
      { id: 'ch3_f16', front: 'What was the Gunpowder Plot?', back: 'A failed attempt to blow up Parliament in 1605 by Guy Fawkes.' }
    ]
  },
  {
    id: 4,
    title: 'A Modern, Thriving Society',
    shortName: 'Modern Society',
    color: '#10B981',
    description: 'Learn about the diverse and vibrant culture, traditions, and daily life in modern Britain.',
    sections: [
      {
        title: 'The UK Today',
        content: [
          'The UK is a diverse and multicultural society. People from many different ethnic backgrounds, religions, and cultures live together. This diversity is celebrated as one of Britain\'s greatest strengths.',
          'The UK has an ageing population. Life expectancy is around 79 years for men and 83 years for women. The population is growing, partly due to immigration.',
          'British society values fairness, equality, and opportunity for all. The Equality Act 2010 protects people from discrimination in the workplace and in wider society.',
          'The UK economy is one of the largest in the world. Major industries include financial services (London is one of the world\'s leading financial centres), technology, creative industries, tourism, manufacturing, and pharmaceuticals.',
          'The education system includes state schools (funded by the government) and independent (private) schools. Education is compulsory for children aged 5 to 18. The UK is home to some of the world\'s most famous universities, including Oxford and Cambridge.'
        ]
      },
      {
        title: 'Religion',
        content: [
          'The UK has been historically Christian. The official church is the Church of England (Anglican), with the monarch as its head. The Church of Scotland is Presbyterian.',
          'Other major religions practised in the UK include Islam, Hinduism, Sikhism, Judaism, and Buddhism. Britain is a multi-faith society, and people are free to practise any religion or none at all.',
          'The Archbishop of Canterbury is the spiritual leader of the Church of England. Important Christian holidays include Christmas (25 December) and Easter (the date varies each year).',
          'Religious diversity is protected by law. Discrimination against someone because of their religion or belief is illegal.'
        ]
      },
      {
        title: 'Customs & Traditions',
        content: [
          'Traditional foods vary across the UK. England is known for roast beef and Yorkshire pudding. Scotland is famous for haggis. Wales has Welsh cakes and bara brith. Northern Ireland has the Ulster fry.',
          'Popular British foods include fish and chips, the full English breakfast, the Sunday roast, and afternoon tea. Chicken tikka masala is sometimes called Britain\'s national dish due to the popularity of Indian food.',
          'Bank holidays are public holidays when most people have a day off work. There are eight bank holidays each year in England and Wales, nine in Scotland, and ten in Northern Ireland.',
          'Important annual events include Remembrance Day (11 November), when people wear poppies to remember those who died in war; and Trooping the Colour, the monarch\'s official birthday celebration in June.'
        ]
      },
      {
        title: 'Sport',
        content: [
          'Football (soccer) is the most popular sport in the UK. The modern rules of football were codified in England in the 19th century. The FA Cup is the oldest football competition in the world.',
          'Rugby is popular in different forms: Rugby Union is played throughout the UK, while Rugby League is concentrated in northern England. The Six Nations Championship is a major rugby competition.',
          'Cricket is played mainly in England and Wales. The Ashes is a famous Test series between England and Australia.',
          'Wimbledon, first held in 1877, is the oldest tennis tournament in the world. Tennis is played on grass courts at the All England Club.',
          'Other popular sports include golf (The Open Championship is the oldest golf tournament), horse racing (the Grand National and Royal Ascot are major events), rowing (the Oxford and Cambridge Boat Race), and athletics.'
        ]
      },
      {
        title: 'Arts & Culture',
        content: [
          'The UK has produced many of the world\'s greatest writers, including William Shakespeare, Charles Dickens, Jane Austen, and more recently J.K. Rowling. The Edinburgh Festival is one of the world\'s largest arts festivals.',
          'British music has had a global influence, from The Beatles and The Rolling Stones to Adele and Ed Sheeran. The UK has a strong tradition of classical music, folk music, and pop/rock.',
          'The BBC (British Broadcasting Corporation) is a publicly funded broadcaster known worldwide for its news, drama, and documentaries. It is funded by the TV licence fee.',
          'British film and television have won international acclaim. The UK has produced award-winning films and popular TV series. The BAFTA awards recognise excellence in film and television.',
          'Museums and galleries in the UK include the British Museum, the National Gallery, the Tate Modern, the Natural History Museum, and the Science Museum \u2014 many of which are free to enter.'
        ]
      },
      {
        title: 'Leisure',
        content: [
          'Pubs are an important part of British social life. The tradition of the "local pub" dates back centuries. Pubs often serve traditional British food and host community events.',
          'Gardening is a popular hobby in the UK. The Chelsea Flower Show is one of the world\'s most famous gardening events.',
          'The National Trust and National Trust for Scotland are charities that protect historic houses, gardens, and natural landscapes. They are popular places to visit.',
          'The UK has many beautiful areas of countryside, including 15 national parks in England and Wales and two in Scotland. Walking, cycling, and outdoor activities are popular pastimes.',
          'Many British people enjoy visiting the seaside. Popular coastal destinations include Brighton, Blackpool, and Cornwall. Fish and chips by the seaside is a traditional British experience.'
        ]
      }
    ],
    keyFacts: [
      { question: 'What is the official church of England?', answer: 'The Church of England (Anglican).' },
      { question: 'Who is the head of the Church of England?', answer: 'The monarch (King Charles III).' },
      { question: 'What is the Church of Scotland called?', answer: 'Presbyterian.' },
      { question: 'Name two major non-Christian religions in the UK.', answer: 'Islam and Hinduism.' },
      { question: 'What is the most popular sport in the UK?', answer: 'Football (soccer).' },
      { question: 'What is the oldest tennis tournament in the world?', answer: 'Wimbledon.' },
      { question: 'What is the name of Scotland\'s national poet?', answer: 'Robert Burns.' },
      { question: 'What is the BBC?', answer: 'The British Broadcasting Corporation.' },
      { question: 'How many bank holidays are there in England and Wales?', answer: 'Eight.' },
      { question: 'What are two traditional British foods?', answer: 'Fish and chips; roast beef and Yorkshire pudding.' },
      { question: 'When is Remembrance Day?', answer: '11 November.' },
      { question: 'What flower is worn for Remembrance Day?', answer: 'A poppy.' }
    ],
    flashcards: [
      { id: 'ch4_f1', front: 'What is the official church of England?', back: 'The Church of England (Anglican).' },
      { id: 'ch4_f2', front: 'Who is the head of the Church of England?', back: 'The British monarch.' },
      { id: 'ch4_f3', front: 'What is the most popular sport in the UK?', back: 'Football (soccer).' },
      { id: 'ch4_f4', front: 'When was the first Wimbledon held?', back: '1877.' },
      { id: 'ch4_f5', front: 'What is the BBC?', back: 'The British Broadcasting Corporation.' },
      { id: 'ch4_f6', front: 'Who is Scotland\'s national poet?', back: 'Robert Burns.' },
      { id: 'ch4_f7', front: 'What does the TV licence fund?', back: 'The BBC.' },
      { id: 'ch4_f8', front: 'When is Remembrance Day?', back: '11 November.' },
      { id: 'ch4_f9', front: 'What flower is worn on Remembrance Day?', back: 'A poppy.' },
      { id: 'ch4_f10', front: 'What is the oldest football competition?', back: 'The FA Cup.' },
      { id: 'ch4_f11', front: 'Name two famous British bands.', back: 'The Beatles, The Rolling Stones, etc.' },
      { id: 'ch4_f12', front: 'What does the National Trust protect?', back: 'Historic houses, gardens, and landscapes.' }
    ]
  },
  {
    id: 5,
    title: 'The UK Government, the Law and Your Role',
    shortName: 'Government & Law',
    color: '#8B5CF6',
    description: 'Understand how the UK government works, the legal system, and your role as a citizen.',
    sections: [
      {
        title: 'Development of British Democracy',
        content: [
          'British democracy developed gradually over many centuries. Unlike many countries, the UK does not have a single written constitution. Instead, it has constitutional conventions, important laws, and traditions that have developed over time.',
          'In medieval times, kings and queens had almost unlimited power. The Magna Carta (1215) was the first step in limiting the power of the monarch. It established that the king was subject to the law.',
          'Parliament gradually became more powerful. The Model Parliament of 1295 was the first to include not just nobles and church leaders but also representatives of the common people.',
          'The Bill of Rights 1689 established that Parliament had more power than the monarch. It laid down rules about how the monarch should rule, including that they could not raise taxes without Parliament\'s approval.',
          'Over the 19th and 20th centuries, the right to vote was gradually extended. The Reform Acts of 1832, 1867, and 1884 gave more men the vote. Women gained the right to vote in 1918 (for those over 30) and in 1928 (for those over 21, same as men). The voting age was lowered to 18 in 1969.'
        ]
      },
      {
        title: 'The British Constitution',
        content: [
          'The UK does not have a single written constitution. Its constitution is made up of several sources: statute law (Acts of Parliament), common law (based on judicial decisions), conventions (established practices), and works of authority (writings by constitutional experts).',
          'Important constitutional principles include the rule of law (everyone is subject to the law), parliamentary sovereignty (Parliament is the supreme legal authority), and the separation of powers between the executive, legislature, and judiciary.',
          'Constitutional monarchy means the monarch is the head of state but must remain politically neutral and act on the advice of ministers. The monarch\'s role is largely ceremonial but includes formally appointing the Prime Minister, opening Parliament, and giving Royal Assent to bills.',
          'Devolution is the transfer of power from the UK Parliament to regional governments. The Scottish Parliament, the Welsh Parliament (Senedd), and the Northern Ireland Assembly have powers over areas such as health, education, and transport in their respective countries.'
        ]
      },
      {
        title: 'The Government',
        content: [
          'The Prime Minister is the leader of the party that wins the most seats in a general election. They appoint ministers to run government departments. The Cabinet, made up of senior ministers, makes important decisions about government policy.',
          'The UK Parliament has two Houses: the House of Commons and the House of Lords. The House of Commons is elected and has the primary law-making role. The House of Lords scrutinises and revises proposed laws.',
          'MPs (Members of Parliament) are elected every five years (or sooner if an early election is called) to represent their constituencies in the House of Commons.',
          'The opposition is the party or parties that are not in government. The Leader of the Opposition leads the second-largest party and holds the government to account.',
          'Local government is responsible for services in a particular area, such as rubbish collection, libraries, and local planning. Councillors are elected to make decisions about these services.'
        ]
      },
      {
        title: 'The UK & International Institutions',
        content: [
          'The UK is a member of the United Nations (UN), NATO, the Commonwealth, and the Council of Europe. It left the European Union (Brexit) in 2020.',
          'The UN was established after World War II to promote international cooperation, maintain peace and security, and protect human rights. The UK is one of five permanent members of the UN Security Council.',
          'NATO (North Atlantic Treaty Organisation) is a military alliance between North American and European countries. It was founded in 1949 for collective defence.',
          'The Commonwealth is a voluntary association of 56 countries, most of which were formerly part of the British Empire. It promotes democracy, human rights, and economic cooperation.',
          'The Council of Europe promotes human rights across Europe through the European Convention on Human Rights. This is separate from the European Union.'
        ]
      },
      {
        title: 'Respecting the Law',
        content: [
          'The UK legal system protects the rights of individuals and sets out the rules that everyone must follow. It is based on common law, where judges\' decisions in previous cases help to shape the law.',
          'There are two main types of law: criminal law and civil law. Criminal law deals with offences against society (e.g., theft, assault). Civil law deals with disputes between individuals or organisations (e.g., contracts, property, divorce).',
          'Magistrates\' Courts deal with minor criminal cases. The Crown Court deals with more serious criminal cases. County Courts handle civil disputes. The High Court deals with the most serious civil cases. The Court of Appeal hears appeals. The Supreme Court is the highest court in the UK.',
          'Everyone accused of a crime has the right to a fair trial. They are innocent until proven guilty. A jury may be used for serious criminal cases.',
          'It is illegal to discriminate against someone because of their race, sex, disability, age, religion, or other protected characteristics. Hate crimes and hate speech are illegal.'
        ]
      },
      {
        title: 'Your Role in the Community',
        content: [
          'As a resident of the UK, you can contribute to your community in many ways. This includes voting in elections, volunteering for local organisations or charities, and taking part in community activities.',
          'Local councillors are elected to represent their communities and make decisions about local services. You can contact your local councillor if you have concerns about local issues.',
          'Charities play an important role in British society. They work to help people, animals, the environment, or advance a particular cause. You can support charities by donating money or volunteering your time.',
          'The UK has a strong tradition of volunteering. Many people give their time to help others without being paid. This includes activities like helping at a local food bank, mentoring young people, or participating in community clean-ups.',
          'Being a good neighbour and looking out for those around you, particularly elderly or vulnerable people, is an important part of community life in the UK.'
        ]
      }
    ],
    keyFacts: [
      { question: 'Does the UK have a written constitution?', answer: 'No \u2014 it has an unwritten constitution based on statutes, common law, and conventions.' },
      { question: 'When was the Bill of Rights passed?', answer: '1689.' },
      { question: 'Who is the head of state?', answer: 'The monarch (King Charles III).' },
      { question: 'Who appoints the Prime Minister?', answer: 'The monarch, based on who can command the confidence of the House of Commons.' },
      { question: 'What are the two Houses of Parliament?', answer: 'The House of Commons and the House of Lords.' },
      { question: 'How often are general elections held?', answer: 'At least every five years.' },
      { question: 'What is devolution?', answer: 'The transfer of power from the UK Parliament to regional governments in Scotland, Wales, and Northern Ireland.' },
      { question: 'What does NATO stand for?', answer: 'North Atlantic Treaty Organisation.' },
      { question: 'What is the Commonwealth?', answer: 'A voluntary association of 56 countries, most formerly part of the British Empire.' },
      { question: 'What is the difference between criminal and civil law?', answer: 'Criminal law deals with offences against society; civil law deals with disputes between individuals.' },
      { question: 'What is the highest court in the UK?', answer: 'The Supreme Court.' },
      { question: 'What is the voting age in the UK?', answer: '18.' }
    ],
    flashcards: [
      { id: 'ch5_f1', front: 'Does the UK have a written constitution?', back: 'No \u2014 it has conventions, statutes, and common law.' },
      { id: 'ch5_f2', front: 'When was the Bill of Rights passed?', back: '1689.' },
      { id: 'ch5_f3', front: 'Who is the head of state?', back: 'The British monarch.' },
      { id: 'ch5_f4', front: 'What are the two Houses of Parliament?', back: 'The House of Commons and the House of Lords.' },
      { id: 'ch5_f5', front: 'How often must elections be held?', back: 'At least every five years.' },
      { id: 'ch5_f6', front: 'What is devolution?', back: 'Transferring powers to Scotland, Wales, and Northern Ireland.' },
      { id: 'ch5_f7', front: 'What does NATO stand for?', back: 'North Atlantic Treaty Organisation.' },
      { id: 'ch5_f8', front: 'How many countries are in the Commonwealth?', back: '56.' },
      { id: 'ch5_f9', front: 'What is criminal law?', back: 'Law dealing with offences against society.' },
      { id: 'ch5_f10', front: 'What is the highest UK court?', back: 'The Supreme Court.' },
      { id: 'ch5_f11', front: 'What is the voting age?', back: '18.' },
      { id: 'ch5_f12', front: 'What is a civil law case?', back: 'A dispute between individuals or organisations.' }
    ]
  }
];

export function getChapterContent(chapterId: number): ChapterContent | undefined {
  return chapterContents.find((ch) => ch.id === chapterId);
}
