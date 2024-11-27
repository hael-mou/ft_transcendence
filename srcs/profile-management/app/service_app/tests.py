from django.test import TestCase

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Profile, FriendShipRequest
from django.contrib.auth.models import User

# class ProfileViewsTestCase(APITestCase):
#     def setUp(self):
#         # Create a test user
#         self.user = User.objects.create_user(username='testuser', password='password123')
#         self.client.login(username='testuser', password='password123')
        
#         # Create test profiles
#         self.profile1 = Profile.objects.create(username='testuser', first_name='John', last_name='Doe')
#         self.profile2 = Profile.objects.create(username='user2', first_name='Jane', last_name='Doe')
#         self.profile3 = Profile.objects.create(username='user3', first_name='Jim', last_name='Beam')

#     def test_profiles_list(self):
#         response = self.client.get(reverse('crud_profile')) 
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 3)  # Expecting 3 profiles

#     def test_profiles_filter_by_first_name(self):
#         response = self.client.get(reverse('crud_profile'), {'first_name': 'John'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)  # Only one profile matches

#     def test_profiles_filter_by_last_name(self):
#         response = self.client.get(reverse('crud_profile'), {'last_name': 'Doe'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 2)  # Two profiles match

#     def test_my_profile(self):
#         response = self.client.get(reverse('profile_detail'), {'username': self.user.username})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['username'], self.user.username)

#     def test_my_profile_query_params(self):
#         response = self.client.get(reverse('profile_detail'), {'friends': True})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         # Check if 'friends' is in the response data
#         self.assertIn('friends', response.data)

#     def test_update_profile(self):
#         data = {'first_name': 'Johnny'}
#         response = self.client.patch(reverse('profile_detail'), data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.profile1.refresh_from_db()
#         self.assertEqual(self.profile1.first_name, 'Johnny') # should be updated

#     def test_delete_profile(self):
#         response = self.client.delete(reverse('profile_detail'))
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         with self.assertRaises(Profile.DoesNotExist):
#             self.profile1.refresh_from_db() # shooul araise a DoesNotExist


from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Profile, FriendShipRequest
from .serializers.friends import (
    FriendShipSerializer,
    AcceptFriendSerializer,
    RejectSerializer,
    CancelSerializer,
    RemoveFriendSerializer,
)

class ProfileTestCase(APITestCase):
    def setUp(self):
        # Create test users
        self.user1 = Profile.objects.create(username='user1', first_name='User', last_name='One')
        self.user2 = Profile.objects.create(username='user2', first_name='User', last_name='Two')
        self.user3 = Profile.objects.create(username='user3', first_name='User', last_name='Three')

    def test_friendship_creation(self):
        # Simulate the request to send a friend request
        self.client.force_authenticate(user=self.user1)

        data = {'receiver_id': self.user2.id}
        serializer = FriendShipSerializer(data=data, context={'request': self.client})

        # Validate the serializer
        self.assertTrue(serializer.is_valid())
        
        # Create the friendship
        friendship_request = serializer.save()
        self.assertEqual(friendship_request.sender_profile, self.user1)
        self.assertEqual(friendship_request.receiver_profile, self.user2)

    def test_friendship_creation_self_request(self):
        self.client.force_authenticate(user=self.user1)

        data = {'receiver_id': self.user1.id}
        serializer = FriendShipSerializer(data=data, context={'request': self.client})

        self.assertFalse(serializer.is_valid())
        self.assertIn("You can't add yourself as a friend", str(serializer.errors))

    # def test_accept_friendship(self):
    #     # Send a friend request from user1 to user2
    #     FriendShipRequest.objects.create(sender_profile=self.user1, receiver_profile=self.user2)
    #     self.client.force_authenticate(user=self.user2)
    #     data = {'sender_id': self.user1.id}
    #     serializer = AcceptFriendSerializer(data=data, context={'request': self.user2})
    #     # import pdb; pdb.set_trace()
    #     self.assertTrue(serializer.is_valid())
    #     friend_request = serializer.save()
    #     self.assertEqual(friend_request.status, 1)  # Accepted
    #     self.assertTrue(self.user2.friends.filter(id=self.user1.id).exists())

    def test_reject_friendship(self):
        # Send a friend request
        friend_request = FriendShipRequest.objects.create(sender_profile=self.user1, receiver_profile=self.user2)

        self.client.force_authenticate(user=self.user2)

        data = {'sender_id': self.user1.id}
        serializer = RejectSerializer(data=data, context={'request': self.client})

        self.assertTrue(serializer.is_valid())
        
        # Reject the friendship
        serializer.save()
        with self.assertRaises(FriendShipRequest.DoesNotExist):
            FriendShipRequest.objects.get(id=friend_request.id)  # The request should be deleted

    # def test_cancel_friendship_request(self):
    #     # User1 sends a friend request to User2
    #     friend_request = FriendShipRequest.objects.create(sender_profile=self.user1, receiver_profile=self.user2)

    #     self.client.force_authenticate(user=self.user1)

    #     data = {'receiver_id': self.user2.id}
    #     serializer = CancelSerializer(data=data, context={'request': self.client})

    #     self.assertTrue(serializer.is_valid())
        
    #     # Cancel the friendship request
    #     serializer.save()
    #     with self.assertRaises(FriendShipRequest.DoesNotExist):
    #         FriendShipRequest.objects.get(id=friend_request.id)  # The request should be deleted

    # def test_remove_friend(self):
    #     # First, establish a friendship
    #     self.user1.friends.add(self.user2)

    #     self.client.force_authenticate(user=self.user1)

    #     data = {'friend_id': self.user2.id}
    #     serializer = RemoveFriendSerializer(data=data, context={'request': self.client})

    #     self.assertTrue(serializer.is_valid())
        
    #     # Remove the friend
    #     serializer.save()
    #     self.assertFalse(self.user1.friends.filter(id=self.user2.id).exists())
