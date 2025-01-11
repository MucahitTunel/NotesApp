import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type StatusType = 'success' | 'error';

type StatusDialogProps = {
  visible: boolean;
  type: StatusType;
  message: string;
  onClose: () => void;
};

const StatusDialog: React.FC<StatusDialogProps> = ({
  visible,
  type,
  message,
  onClose,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View style={styles.content}>
                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    <Icon
                      name={type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                      size={32}
                      color={type === 'success' ? '#4CAF50' : '#FF3B30'}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>
                      {type === 'success' ? 'İşlem Başarılı' : 'Hata'}
                    </Text>
                    <Text style={styles.message}>{message}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, type === 'success' ? styles.successButton : styles.errorButton]}
                  onPress={onClose}>
                  <Text style={styles.buttonText}>Tamam</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  buttons: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButton: {
    backgroundColor: '#FFFFFF',
  },
  errorButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default StatusDialog; 