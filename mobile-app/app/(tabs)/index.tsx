import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { apiClient } from '../../lib/api';
import { 
  Bell, 
  CloudSun, 
  PawPrint, 
  Droplet, 
  Triangle, 
  Plus, 
  ScanLine, 
  Syringe, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalAnimals: 0 });
  const [milkStats, setMilkStats] = useState({ totalToday: 0, totalThisMonth: 0, recordCount: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [data, milk] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getMilkStats(),
      ]);
      setStats(data);
      setMilkStats(milk);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'User';

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E632" />
        }
      >
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <View style={styles.greetingRowContainer}>
                <Text style={styles.greetingTitle}>Good Morning,</Text>
            </View>
            <Text style={styles.greetingName}>{firstName}</Text>
          </View>
          
          <View style={styles.headerRight}>
             {/* Weather Widget */}
             <View style={styles.weatherWidget}>
                <CloudSun size={24} color="#FDB813" />
                <Text style={styles.weatherTemp}>18°C</Text>
             </View>
             
          </View>
        </View>

        {/* Stats Cards Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsScrollContent}>
          
          {/* Card 1: Cattle */}
          <LinearGradient
            colors={['#102815', '#163320']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(91, 154, 250, 0.2)' }]}>
                <PawPrint size={20} color="#5B9AFA" />
              </View>
              <Text style={styles.cardLabel}>Total Cattle</Text>
            </View>
            
            <View>
               <Text style={styles.cardValue}>{stats?.totalAnimals || 0}</Text>
               <View style={styles.trendRow}>
                  <Text style={styles.trendIcon}>↗</Text>
                  <Text style={styles.trendText}>+2 born</Text>
               </View>
            </View>
          </LinearGradient>

          {/* Card 2: Milk Yield */}
          <LinearGradient
            colors={['#102815', '#163320']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
             <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 230, 50, 0.2)' }]}>
                <Droplet size={20} color="#00E632" />
              </View>
              <Text style={styles.cardLabel}>Morning Yield</Text>
            </View>
            
            <View>
              <Text style={styles.cardValue}>{milkStats.totalToday.toFixed(1)}L</Text>
              <View style={styles.progressBarContainer}>
                 <View style={[styles.progressBarFill, { width: '90%' }]} />
              </View>
              <Text style={styles.progressText}>90% of target</Text>
            </View>
          </LinearGradient>

          {/* Card 3: Alert (Partial) */}
          <LinearGradient
            colors={['#2A1515', '#3A1515']}
            style={[styles.statCard, { marginRight: 24, borderColor: '#3A1515' }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
             <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Triangle size={20} color="#EF4444" />
              </View>
              <Text style={styles.cardLabel}>Alerts</Text>
            </View>
            <View>
               <Text style={styles.cardValue}>3</Text>
               <Text style={[styles.trendText, {  color: '#EF4444' }]}>2 High Priority</Text>
            </View>
          </LinearGradient>

        </ScrollView>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
           <TouchableOpacity style={[styles.actionButton, styles.primaryBtn]} onPress={() => router.push('/add-animal')}>
              <View style={styles.btnIconCircleBlack}>
                 <Plus size={28} color="#000" />
              </View>
              <Text style={styles.primaryBtnText}>Add Record</Text>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.actionButton, styles.secondaryBtn]} onPress={() => router.push('/milk-production')}>
              <View style={[styles.btnIconCircleGreen, { backgroundColor: 'rgba(0, 230, 50, 0.1)' }]}>
                 <Droplet size={28} color="#00E632" />
              </View>
              <Text style={styles.secondaryBtnText}>Milk Log</Text>
           </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
             <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
           
           {/* Activity Item 1 */}
           <View style={styles.activityItem}>
              <View style={[styles.activityIconBox, { backgroundColor: '#2A1F3D' }]}>
                 <Syringe size={20} color="#A78BFA" />
              </View>
              <View style={styles.activityContent}>
                 <Text style={styles.activityTitle}>Vet Visit Scheduled</Text>
                 <Text style={styles.activitySubtitle}>Dr. Smith • General Checkup</Text>
              </View>
              <Text style={styles.activityTime}>1h ago</Text>
           </View>

           {/* Activity Item 2 */}
            <View style={styles.activityItem}>
              <View style={[styles.activityIconBox, { backgroundColor: 'rgba(0, 230, 50, 0.1)' }]}>
                 <CheckCircle size={20} color="#00E632" />
              </View>
              <View style={styles.activityContent}>
                 <Text style={styles.activityTitle}>Milking Batch A</Text>
                 <Text style={styles.activitySubtitle}>Completed • 250L Collected</Text>
              </View>
              <Text style={styles.activityTime}>20m ago</Text>
           </View>
           
        </View>
        
        {/* Extra space at bottom for tab bar */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051207',
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greetingRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  headerRight: {
     alignItems: 'flex-end',
     gap: 12,
  },
  weatherWidget: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  weatherTemp: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
    fontSize: 14,
  },
  bellButton: {
    position: 'relative',
    marginTop: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statsScroll: {
    marginBottom: 32,
  },
  statsScrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  statCard: {
    width: 150,
    height: 170,
    backgroundColor: '#102815',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  cardTop: {
     alignItems: 'flex-start',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendIcon: {
    color: '#00E632',
    fontSize: 16,
  },
  trendText: {
    color: '#00E632',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#1D3B24',
    borderRadius: 3,
    width: '100%',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00E632',
    borderRadius: 3,
  },
  progressText: {
    color: '#8BA890',
    fontSize: 11,
    fontWeight: '500', 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 24,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    height: 140,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    shadowColor: "#00E632",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtn: {
    backgroundColor: '#00E632',
  },
  secondaryBtn: {
    backgroundColor: '#0D1F12', 
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  btnIconCircleBlack: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIconCircleGreen: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 230, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#051207', 
  },
  secondaryBtnText: {
     fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
    marginBottom: 16,
  },
  viewAllText: {
    color: '#00E632',
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102815',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D3B24',
  },
  activityIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#8BA890',
  },
  activityTime: {
    color: '#8BA890',
    fontSize: 12,
    fontWeight: '500',
  },
});
