export interface StateLocationData {
  state: string;
  stateHi: string;
  districts: {
    district: string;
    districtHi: string;
    tehsils: {
      tehsil: string;
      tehsilHi: string;
    }[];
  }[];
}

export const mockLocations: StateLocationData[] = [
  {
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    districts: [
      {
        district: 'Nagaur',
        districtHi: 'नागौर',
        tehsils: [
          { tehsil: 'Merta', tehsilHi: 'मेड़ता' },
          { tehsil: 'Nagaur', tehsilHi: 'नागौर' },
          { tehsil: 'Degana', tehsilHi: 'डेगाना' },
          { tehsil: 'Didwana', tehsilHi: 'डीडवाना' },
          { tehsil: 'Jayal', tehsilHi: 'जायल' },
          { tehsil: 'Ladnun', tehsilHi: 'लाडनूं' },
          { tehsil: 'Makrana', tehsilHi: 'मकराना' },
          { tehsil: 'Parbatsar', tehsilHi: 'परबतसर' },
        ],
      },
      {
        district: 'Jodhpur',
        districtHi: 'जोधपुर',
        tehsils: [
          { tehsil: 'Bilara', tehsilHi: 'बिलाड़ा' },
          { tehsil: 'Luni', tehsilHi: 'लूणी' },
          { tehsil: 'Osian', tehsilHi: 'ओसियां' },
          { tehsil: 'Phalodi', tehsilHi: 'फलोदी' },
          { tehsil: 'Piparcity', tehsilHi: 'पीपाड़ शहर' },
        ],
      },
      {
        district: 'Jaipur',
        districtHi: 'जयपुर',
        tehsils: [
          { tehsil: 'Chaksu', tehsilHi: 'चाकसू' },
          { tehsil: 'Chomu', tehsilHi: 'चौमू' },
          { tehsil: 'Phulera', tehsilHi: 'फुलेरा' },
          { tehsil: 'Kotputli', tehsilHi: 'कोटपूतली' },
          { tehsil: 'Sanganer', tehsilHi: 'सांगानेर' },
        ],
      },
      {
        district: 'Barmer',
        districtHi: 'बाड़मेर',
        tehsils: [
          { tehsil: 'Balotra', tehsilHi: 'बालोतरा' },
          { tehsil: 'Baytoo', tehsilHi: 'बायतु' },
          { tehsil: 'Gudamalani', tehsilHi: 'गुड़ामालानी' },
          { tehsil: 'Siwana', tehsilHi: 'सिवाना' },
        ],
      },
    ],
  },
  {
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    districts: [
      {
        district: 'Pune',
        districtHi: 'पुणे',
        tehsils: [
          { tehsil: 'Baramati', tehsilHi: 'बारामती' },
          { tehsil: 'Haveli', tehsilHi: 'हवेली' },
          { tehsil: 'Shirur', tehsilHi: 'शिरूर' },
          { tehsil: 'Indapur', tehsilHi: 'इंदापूर' },
        ],
      },
      {
        district: 'Nashik',
        districtHi: 'नाशिक',
        tehsils: [
          { tehsil: 'Niphad', tehsilHi: 'निफाड' },
          { tehsil: 'Malegaon', tehsilHi: 'मालेगाव' },
          { tehsil: 'Yeola', tehsilHi: 'येवला' },
          { tehsil: 'Sinnar', tehsilHi: 'सिन्नर' },
        ],
      },
    ],
  },
  {
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    districts: [
      {
        district: 'Indore',
        districtHi: 'इंदौर',
        tehsils: [
          { tehsil: 'Sanwer', tehsilHi: 'सांवेर' },
          { tehsil: 'Depalpur', tehsilHi: 'देपालपुर' },
          { tehsil: 'Mhow', tehsilHi: 'महू' },
        ],
      },
      {
        district: 'Ujjain',
        districtHi: 'उज्जैन',
        tehsils: [
          { tehsil: 'Badnagar', tehsilHi: 'बड़नगर' },
          { tehsil: 'Mahidpur', tehsilHi: 'महिदपुर' },
          { tehsil: 'Nagda', tehsilHi: 'नागदा' },
        ],
      },
    ],
  },
  {
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    districts: [
      {
        district: 'Varanasi',
        districtHi: 'वाराणसी',
        tehsils: [
          { tehsil: 'Pindra', tehsilHi: 'पिंडरा' },
          { tehsil: 'Sadar', tehsilHi: 'सदर' },
        ],
      },
      {
        district: 'Agra',
        districtHi: 'आगरा',
        tehsils: [
          { tehsil: 'Fatehabad', tehsilHi: 'फतेहाबाद' },
          { tehsil: 'Etmadpur', tehsilHi: 'एत्मादपुर' },
          { tehsil: 'Kheragarh', tehsilHi: 'खेरागढ़' },
        ],
      },
    ],
  },
];
