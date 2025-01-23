import { StyleSheet } from 'react-native';

const communityStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa', // Light background color
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    postInput: {
        flex: 1,
        fontSize: 14, // Reduced font size
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        marginRight: 10,
        backgroundColor: '#f1f1f1', // Subtle background color
    },
    postContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    postTitle: {
        fontSize: 16, // Adjusted font size for better fit
        fontWeight: 600,
        marginBottom: 5,
        color: '#2c3e50', // Dark text for titles
    },
    editButton: {
        position: 'absolute',
        top: 10, // ระยะห่างจากขอบบนของการ์ด
        right: 10, // ระยะห่างจากขอบขวาของการ์ด
        zIndex: 1, // ทำให้ปุ่มอยู่เหนือองค์ประกอบอื่น ๆ
    },
    likeDislikeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15, // Reduced margin
        backgroundColor: '#eafaf1', // Light green background
        borderRadius: 8,
        paddingHorizontal: 8, // Adjusted padding
        paddingVertical: 4, // Adjusted padding
    },
    dislikeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15, // Reduced margin
        backgroundColor: '#fbe9e7', // Light red background
        borderRadius: 8,
        paddingHorizontal: 8, // Adjusted padding
        paddingVertical: 4, // Adjusted padding
    },
    likeDislikeText: {
        marginLeft: 6, // Reduced margin
        fontSize: 14, // Adjusted font size
        color: '#333',
    },
    profileImage: {
        width: 40, // Reduced profile image size
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    createCalendarButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginBottom: 8,
        flex: 1,
        marginRight: 5,
    },
    createCalendarButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
        textAlign: 'center',
    },
    createPostButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginBottom: 8,
        flex: 1,
        marginRight: 5,
    },
    createPostButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
        textAlign: 'center',
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    postDate: {
        fontSize: 12, // Adjust font size
        color: '#7f8c8d', // Gray color for the date
        marginTop: 5, // Add some space between name and date
        marginBottom: 10, // Space after the date
        fontStyle: 'italic', // Optionally make the text italic for a softer look
    },
});

export default communityStyles;
