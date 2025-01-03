export const reportModel = {
    reporter: {
      _id: '',
      firstName: '',
      lastName: '',
      email: '',
      number: '',
      address: {
        streetAddress: '',
        barangay: '',
        city: '',
        zipCode: ''
      }
    },
    type: '',
    personInvolved: {
      firstName: '',
      lastName: '',
      alias: '',
      relationship: '',
      dateOfBirth: new Date(),
      age: '',
      lastSeenDate: new Date(),
      lastSeenTime: '',
      lastKnownLocation: '',
      mostRecentPhoto: {
        name: '',
        type: '',
        uri: ''
      },
      // Physical Description
      gender: '',
      customGender: '',
      race: '',
      height: '',
      weight: '',
      eyeColor: '',
      hairColor: '',
      scarsMarksTattoos: '',
      birthDefects: '',
      prosthetics: '',
      bloodType: '',
      medications: '',
      lastKnownClothing: '',
      contactInformation: '',
      otherInformation: ''
    },
    location: {
      type: 'Point',
      coordinates: [],
      address: {
        streetAddress: '',
        barangay: '',
        city: '',
        zipCode: ''
      }
    },
    policeStation: {
      isAutoAssign: true,
      station: null
    },
    additionalImages: []
  };