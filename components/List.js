import React from 'react';
import { StyleSheet, Text, SectionList, View, TouchableOpacity } from 'react-native';
import { getNotes, events } from '../utils/db';
import moment from 'moment';

function pad(n){return n<10 ? '0'+n : n}

export default class List extends React.Component {
  state = {
    items: [],
    selectedItem: '',
  };

  componentWillMount() {
    events.on('newData', this.updateItems);
    events.emit('newData');
  }

  updateItems = () => {
    getNotes().then((items) => {
      this.setState({
        items,
      });
    })
  }

  componentWillUnmount() {
    events.off('newData', this.updateItems)
  }
  
  sortByDate = (a, b) => {
    var dateA = moment(a || '10000 - 01', 'YYYY - MM');
    var dateB = moment(b || '10000 - 01', 'YYYY - MM');
    return dateB.diff(dateA);
  }

  sortByDate2 = (a, b) => {
    var dateA = moment(a.lastUpdate || '10000 - 01');
    var dateB = moment(b.lastUpdate || '10000 - 01');
    return dateB.diff(dateA);
  }

  getSections() {
    const sections = {
      today: [],
      yesterday: [],
      week: [],
      months: {},
    };

    this.state.items.forEach((item) => {
      const itemData = moment(item.createDate);
      const currentDate = moment(new Date());

      if (itemData.isAfter(currentDate.startOf('day'))) {
        sections.today.push(item);
        return;
      }
      if (itemData.isAfter(currentDate.startOf('day').add(1, 'd'))) {
        sections.yesterday.push(item);
        return;
      }
      if (itemData.isAfter(currentDate.startOf('week'))) {
        sections.week.push(item);
        return;
      }

      const year = itemData.year();
      const month = pad(itemData.month() + 1, 2);
      if (!sections.months[`${year} - ${month}`]) sections.months[`${year} - ${month}`] = [];
      sections.months[`${year} - ${month}`].push(item);
    });

    const data = [];

    if (sections.today.length) {
      data.push({
        title: 'dziś...',
        data: sections.today.sort(this.sortByDate2),
      });
    }

    if (sections.yesterday.length) {
      data.push({
        title: 'wczoraj...',
        data: sections.yesterday.sort(this.sortByDate2),
      });
    }

    if (sections.week.length) {
      data.push({
        title: 'w tym tygodniu...',
        data: sections.week.sort(this.sortByDate2),
      });
    }

    Object.keys(sections.months).sort(this.sortByDate).forEach((month) => {
      if (!sections.months[month].length) return;
      data.push({
        title: month,
        data: sections.months[month].sort(this.sortByDate2),
      });
    });

    return data;
  }

  onPress = (item) => (event) => {
    this.props.onPress(item);
    this.setState({
      selectedItem: item.id,
    })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <SectionList
          sections={this.getSections()}
          renderItem={({item}) => (
            <TouchableOpacity 
                style={[styles.itemWrapper, item.id === this.state.selectedItem ? styles.itemWrapperActive : {}]} 
                onPress={this.onPress(item)}>
              <View style={styles.item} >
                <Text style={styles.itemContent} ellipsizeMode="tail" numberOfLines={1}>{item.content}</Text>
                <Text style={styles.itemDate}>{item.createDate}</Text>
              </View>

            </TouchableOpacity>
          )}
          renderSectionHeader={({section}) => <View style={styles.sectionHeaderBox}><Text style={styles.sectionHeader}>{section.title}</Text></View>}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionHeaderBox: {
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 1,
    borderTopColor: '#C9C9C9',
    borderTopWidth: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#F6F6F6',
    color: '#6C6C6C',
  },
  itemWrapper: {
    paddingHorizontal: 20,
    height: 60,
  },
  itemWrapperActive: {
    backgroundColor: '#FBE08C',
  },
  item: {
    height: 60,
    paddingVertical: 10,
    borderBottomColor: '#E7E7E5',
    borderBottomWidth: 1,
  },
  itemContent: {
    fontSize: 18,
    height: 25,
    flex: 1,
  },
  itemDate: {
    fontSize: 12,
    height: 15,
  },
  wrapper: {
    backgroundColor: '#F9F9F7',
    width: '100%',
    height: '100%',
  }
});