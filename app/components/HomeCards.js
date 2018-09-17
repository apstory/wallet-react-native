import React, {
  Component
} from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import {
  connect
} from 'react-redux';
import {
  cardDismiss,
  cardRestoreAll
} from './../redux/actions';
import {
  standardizeString
} from './../util/general';

// import { AreaChart, Grid } from 'react-native-svg-charts';
// import * as shape from 'd3-shape';

import {
  CardContainer,
  Card,
  Button
} from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;

class HomeCards extends Component {
  // renderChart() {
  //   const data = [
  //     50,
  //     10,
  //     40,
  //     95,
  //     -4,
  //     -24,
  //     85,
  //     91,
  //     35,
  //     53,
  //     -53,
  //     24,
  //     50,
  //     -20,
  //     -80,
  //   ];

  //   return (
  //     <AreaChart
  //       style={{ height: 200 }}
  //       data={data}
  //       contentInset={{ top: 30, bottom: 30 }}
  //       curve={shape.curveNatural}
  //       svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}>
  //       <Grid />
  //     </AreaChart>
  //   );
  // }

  renderImage(image) {
    const {
      company_config
    } = this.props;
    if (image === 'pxpay' || company_config.company.id.includes('pxpay')) {
      return ( <
        Image style = {
          styles.imageStylePhoto
        }
        source = {
          require('./../../assets/icons/pxpay.png')
        }
        />
      );
    } else if (image === 'card1') {
      return ( <
        Image style = {
          styles.imageStylePhoto
        }
        source = {
          require('./../../assets/icons/card1.png')
        }
        />
      );
    }

    return ( <
      View style = {
        [
          styles.imageStylePhoto,
          {
            backgroundColor: this.props.company_config.colors.primary
          },
        ]
      }
      />
    );
  }

  renderCards() {
    const {
      profile,
      company_config,
      dismissedCards
    } = this.props;
    const cardConfig = company_config.cards ? company_config.cards.home : null;
    // add welcome card
    let cards = [];
    let i = 0;
    const company = company_config.company ? company_config.company : null;
    console.log(company);
    if (cardConfig) {
      if (
        cardConfig.general.welcome &&
        (!dismissedCards || !dismissedCards.includes('welcome'))
      ) {
        cards[i++] = {
          id: 'welcome',
          title: 'Welcome to ' + (company && company.name ? company.name : 'Rehive'),
          // description: 'A multi-currency wallet built on the Rehive platform.',
          image: company.id.includes('pxpay') || company.id.includes('plue') ?
            '' : 'card1',
          dismiss: true,
        };
      }

      if (cardConfig.general.verified && profile.verified) {
        cards[i++] = {
          id: 'verify',
          description: 'Please verify your account',
          image: company_config.company && company_config.company === 'pxpay_demo' ?
            'pxpay' : 'card2',
          actionLabel: 'GET VERIFIED',
          navigate: 'GetVerified',
        };
      }
      // const customCards = cardConfig.custom;
      // if (customCards) {
      //   for (let j = 0; j < customCards.length; j++) {
      //     if (!dismissedCards || !dismissedCards.includes(customCards[j].id)) {
      //       cards[i++] = customCards[j];
      //     }
      //   }
      // }
    }

    return ( <
      FlatList
      // refreshControl={
      //   <RefreshControl
      //     refreshing={loadingData}
      //     onRefresh={() => fetchData(type)}
      //   />
      // }
      keyboardShouldPersistTaps = "always"
      data = {
        cards
      }
      renderItem = {
        ({
          item
        }) => this.renderCard(item)
      }
      keyExtractor = {
        item => (item.id ? item.id.toString() : null)
      }
      ListFooterComponent = {
        this.renderFooter()
      }
      />
    );
  }

  renderCard(item) {
    const {
      textStyleContent
    } = styles;
    const {
      company_config
    } = this.props;
    let imageString = './../../assets/icons/' + item.image + '.png';
    return ( <
      Card colors = {
        company_config.colors
      }
      key = {
        item.id
      }
      title = {
        item.title
      }
      renderHeader = {
        this.renderImage(item.image)
      }
      colorTitleBackground = {
        company_config.colors.primary
      }
      colorTitleText = {
        company_config.colors.primaryContrast
      }
      onPressActionOne = {
        () =>
        item.navigate ?
        this.props.navigation.navigate(item.navigate) : item.dismiss ? this.props.cardDismiss(item.id) : null
      }
      textActionOne = {
        item.actionLabel ? item.actionLabel : item.dismiss ? 'DISMISS' : ''
      } > {
        item.description ? ( <
          Text style = {
            textStyleContent
          } > {
            item.description
          } < /Text>
        ) : null
      } <
      /Card>
    );
  }

  renderFooter() {
    const {
      dismissedCards,
      cardRestoreAll,
      company_config
    } = this.props;
    const {
      viewStyleFooter
    } = styles;
    if (dismissedCards && dismissedCards.length > 0) {
      return ( <
        View style = {
          viewStyleFooter
        } >
        <
        Button label = "RESTORE ALL"
        textColor = {
          company_config.colors.secondary
        }
        type = "text"
        onPress = {
          cardRestoreAll
        }
        backgroundColor = "transparent" /
        >
        <
        /View>
      );
    }
  }

  render() {
    return <CardContainer > {
      this.renderCards()
    } < /CardContainer>;
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    zIndex: 2,
  },
  imageStylePhoto: {
    width: SCREEN_WIDTH - 16,
    height: 120,
  },
  textStyleContent: {
    fontSize: 16,
    padding: 8,
    paddingHorizontal: 16,
  },
  viewStyleFooter: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const mapStateToProps = ({
  auth,
  user
}) => {
  const {
    company_config
  } = auth;
  const {
    profile,
    dismissedCards
  } = user;
  return {
    company_config,
    profile,
    dismissedCards
  };
};

export default connect(mapStateToProps, {
  cardDismiss,
  cardRestoreAll
})(
  HomeCards,
);